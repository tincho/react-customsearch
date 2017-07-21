import React, {Component} from 'react';

import fetchJSON from './Helpers/fetchJson.js';

import SearchForm from './SearchForm.jsx';
import SearchResult from './SearchResult.jsx';
import { getOffset, getPage } from './Pagination.jsx';

import querystring from 'query-string';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
const get = (haystack, needle, spoon) => haystack[needle] || spoon;
const noop = () => {};

export default class CustomSearch extends Component {

    constructor(props) {
        super(props);
        this.form = {};
        this.src = props.options.src;
        this.columnNames = props.options.columnNames;
        this.fieldFormatters = props.options.fieldFormatters;
        this.routerOff = () => {};

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

    triggerEvt(evt) {
      console.log("Event: ");
      console.log(evt);
    }

    componentWillMount() {
        this.loadColumns();
        // this.listenHistory();
    }

    listenHistory() {
        this.routerOff = history.listen(location => this.loadRoute(location));
    }

    componentDidMount() {
        this.loadRoute(history.location);
    }

    componentWillUnmount() {
        this.routerOff();
    }

    loadRoute(location) {
        if (location.search === "") {
            return;
        }
        let args = querystring.parse(location.search);
        let { q, type, page, order = '' } = args,
            offset = getOffset(this.state.limit, page);

        this.form.q.value = q;
        this.form.type.value = type;

        let parseOrder = order.match(/(\w+)\s+(ASC|DESC)/) || "  ";

        this.loadResults({
            offset,
            order: {
                orderField: parseOrder[1] || "",
                orderDirection: parseOrder[2] || ""
            }
        });
    }

    loadColumns() {
        this.triggerEvt("loading columns");
        fetchJSON(this.src + 'columns/selected')
          .then(cols => this.setState({cols}, () => {
            this.triggerEvt("columns are set in state");
          }));
    }

    search() {
        this.loadResults({}, params => {
            let args = Object.assign({}, params);
            delete args.offset;
            args.page = getPage(this.state.limit, params.offset);
            // this.routerOff();
            history.push('?' + querystring.stringify(args), args);
            // this.listenHistory();
        });
    }

    loadResults({ offset, order }, afterSearch = noop) {
        if (typeof offset === 'undefined') {
            offset = this.state.offset;
        }

        let { q, type } = this.form;
        q = q.value;
        type = Array.from(type).find(i => i.checked).value || 'any';

        let
          params = {
              q, type,
              // limit,
              offset
          },
          { orderField, orderDirection } = order || this.state;

        // conditionally add order:
        let orderStr = orderField + " " + orderDirection;
        if (orderStr.replace(/\s/g, "") !== "") {
            params.order = orderStr;
        }

        let search = querystring.stringify(params);
        this.triggerEvt("will load: " + search);
        fetchJSON(this.src + `search?${search}`).then(data => this.setState({
            q, type,
            loading: false,
            total: data.count,
            //limit: data.limit,
            offset: params.offset,
            data: data.rows,
            orderField, orderDirection
          }, () => {
            this.triggerEvt("loaded results, total: " + data.count);
            afterSearch(params);
          })
        );
    }

    render() {
        // @TODO implement REDUX pattern (and library)
        let formSubmit = (evt) => {
            evt.preventDefault();
            this.setState({
                offset: 0,
                orderField: "",
                orderDirection: ""
            }, this.search)
        };
        let onPaginate = (offset) => {
            offset = this.form.type.value === this.state.type ? offset : 0;
            this.setState({offset}, this.search);
        }
        let onChangeOrder = (orderField, orderDirection) => {
            this.setState({
                offset: 0, // always reset to first page
                orderField, orderDirection
            }, this.search);
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
