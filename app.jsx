import React, {Component} from 'react';

import fetchJSON from './Helpers/fetchJson.js';

import SearchForm from './SearchForm.jsx';
import SearchResult from './SearchResult.jsx';
import { getOffset, getPage } from './Pagination.jsx';

import querystring from 'query-string';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
const get = (haystack, needle, spoon) => haystack[needle] || spoon;

const pushLocation = args => {
    history.push('?' + querystring.stringify(args), args);
}

export default class CustomSearch extends Component {

    constructor(props) {
        super(props);
        this.form = {};
        this.src = props.options.src;
        this.columnNames = props.options.columnNames;
        this.fieldFormatters = props.options.fieldFormatters;

        this.state = {
            data: [],
            cols: [],
            type: "any",
            total: 0,
            limit: parseInt(props.options.limit, 10) || 20,
            offset: 0,
            orderField: "",
            orderDirection: ""
        };
    }

    componentWillMount() {
        this.loadColumns();
    }

    componentDidMount() {
        this.loadRoute(history.location);
    }

    loadRoute({ search }) {
        if (search === "") {
            return;
        }
        let args = querystring.parse(search),
            { q, type, page, order = "" } = args,
            offset = getOffset(this.state.limit, page);

        // set url params to DOM elements
        this.form.q.value = q;
        this.form.type.value = type;

        let [ , // [0] is ignored
            orderField = "",
            orderDirection = ""
        ] = order.match(/(\w+)\s+(ASC|DESC)/) || "  ";

        this.loadResults({
            offset,
            order: { orderField, orderDirection }
        });
    }

    loadColumns() {
        fetchJSON(this.src + 'columns/selected')
          .then(cols => this.setState({cols}));
    }

    loadResults({ offset, order }) {
        if (typeof offset === 'undefined') {
            offset = this.state.offset;
        }

        let { q, type } = this.form;
        q = q.value;
        type = Array.from(type).find(i => i.checked).value || 'any';

        let
          params = {
              q, type,
              offset
          },
          { orderField, orderDirection } = order || this.state;

        // conditionally add order:
        let orderStr = orderField + " " + orderDirection;
        if (orderStr.replace(/\s/g, "") !== "") {
            params.order = orderStr;
        }

        let search = querystring.stringify(params);
        return new Promise((resolve, reject) => {
            fetchJSON(this.src + `search?${search}`).then(data => {
                this.setState({
                    q, type,
                    loading: false,
                    total: data.count,
                    //limit: data.limit,
                    offset: params.offset,
                    data: data.rows,
                    orderField, orderDirection
                }, () => {
                    let args = Object.assign({}, params);
                    delete args.offset;
                    args.page = getPage(this.state.limit, params.offset);
                    resolve(args);
                    // @TODO handle reject !
                })
            });
        });
    }

    render() {
        // @TODO implement REDUX pattern (and library)
        let formSubmit = (evt) => {
            evt.preventDefault();
            this.loadResults({
                offset: 0,
                order: { orderField: "", orderDirection: "" }
            }).then(pushLocation);
        };
        let onPaginate = (offset) => {
            offset = this.form.type.value === this.state.type ? offset : 0;
            this.loadResults({ offset }).then(pushLocation);
        }
        let onChangeOrder = (orderField, orderDirection) => {
            this.loadResults({
                offset: 0,
                order: { orderField, orderDirection }
            }).then(pushLocation);
        };
        return (
            <div>
                <div className="well">
                    <SearchForm onSubmit={formSubmit} formRef={(form) => { this.form = form }} />
                </div>
                <SearchResult
                    onPaginate={onPaginate}
                    onChangeOrder={onChangeOrder}
                    fieldFormatters={this.fieldFormatters}

                    total={parseInt(this.state.total, 10)}
                    limit={parseInt(this.state.limit, 10)}
                    offset={parseInt(this.state.offset, 10)}

                    orderField={this.state.orderField}
                    orderDirection={this.state.orderDirection}

                    columnNames={this.columnNames}
                    cols={this.state.cols}
                    rows={this.state.data} />
            </div>
        );
    }
}
