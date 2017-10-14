/**
 * Entry point for react-customsearch
 * @exports <CustomSearch /> react-customsearch
 */

import React, {Component} from 'react';
import fetchJSON from './Helpers/fetchJson.js';

import SearchForm from './SearchForm.jsx';
import SearchResult from './SearchResult.jsx';
const get = (haystack, needle, spoon) => haystack[needle] || spoon;

import querystring from 'query-string';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
const pushLocation = args => {
    history.push('?' + querystring.stringify(args), args);
}

class CustomSearch extends Component {

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
            page: 1,
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
            { q, type, page, order = "" } = args;

        // set url params to DOM elements
        this.form.q.value = q;
        this.form.type.value = type;

        let [ , // [0] is ignored
            orderField = "",
            orderDirection = ""
        ] = order.match(/(\w+)\s+(ASC|DESC)/) || "  ";

        this.loadResults({
            page,
            order: { orderField, orderDirection }
        });
    }

    loadColumns() {
        fetchJSON(this.src + 'columns/selected')
          .then(cols => this.setState({cols}));
    }

    loadResults({ page = 1, order }) {
        let
          q = this.form.q.value,
          type = Array.from(this.form.type).find(i => i.checked).value || 'any',
          params = { q, type, page },
          { orderField, orderDirection } = order || this.state,
          orderStr = orderField + " " + orderDirection;
        // conditionally add order:
        if (orderStr.replace(/\s/g, "") !== "") {
            params.order = orderStr;
        }

        let search = querystring.stringify(params);
        return new Promise((resolve, reject) => {
            fetchJSON(this.src + `search?${search}`).then(data => {
                this.setState({
                    q, type,
                    orderField, orderDirection,
                    loading: false,
                    total: data.count,
                    page: params.page,
                    data: data.rows
                }, () => {
                    let args = Object.assign({}, params);
                    resolve(args);
                    // @TODO handle reject !
                })
            });
        });
    }

    render() {
        // @TODO implement REDUX pattern (and library)
        const onSearch = evt => {
            evt.preventDefault();
            this.loadResults({
                page: 1,
                order: { orderField: "", orderDirection: "" }
            }).then(pushLocation);
        };
        const onPaginate = page => {
            page = this.form.type.value === this.state.type ? page : 1;
            this.loadResults({ page }).then(pushLocation);
        }
        const onChangeOrder = (orderField, orderDirection) => {
            this.loadResults({
                page: 1,
                order: { orderField, orderDirection }
            }).then(pushLocation);
        };
        return (
            <div className="customsearch">
                <div className="well">
                    <SearchForm onSubmit={onSearch} formRef={(form) => { this.form = form }} />
                </div>
                <SearchResult
                    onPaginate={onPaginate}
                    onChangeOrder={onChangeOrder}
                    fieldFormatters={this.fieldFormatters}

                    total={parseInt(this.state.total, 10)}
                    limit={parseInt(this.state.limit, 10)}
                    page={parseInt(this.state.page, 10)}

                    orderField={this.state.orderField}
                    orderDirection={this.state.orderDirection}

                    columnNames={this.columnNames}
                    cols={this.state.cols}
                    rows={this.state.data} />
            </div>
        );
    }
}

// using this export method because of some webpack thing
module.exports = CustomSearch;
