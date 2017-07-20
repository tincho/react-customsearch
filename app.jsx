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

// var serialize = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

export default class SearchApp extends Component {

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
        let { q, type, page } = args,
            offset = getOffset(this.state.limit, page);

        this.form.q.value = q;
        this.form.type.value = type;

        this.loadResults({ offset, limit: this.state.limit });
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

    loadResults({ offset, limit = 20 }, afterSearch = noop) {
        if (typeof offset === 'undefined') {
            offset = this.state.offset;
        }

        let
          { q, type } = this.form;
        q = q.value;
        type = get(Array.from(type).find(i => i.checked), 'value', 'any');

        let
          { orderField, orderDirection } = this.state,
          order = orderField + " " + orderDirection,
          previousType = this.state.type,
          params = {
              q, type,
              // limit,
              offset : (type === previousType) ? offset : 0 // @TODO re-fix this !
          };

        // conditionally add order:
        if (order.replace(" ", "") !== "") {
            params.order = order;
        }

        let search = querystring.stringify(params);
        this.triggerEvt("will load: " + search);
        fetchJSON(this.src + `search?${search}`).then(data => this.setState({
            q, type,
            loading: false,
            total: data.count,
            //limit: data.limit,
            offset: params.offset,
            data: data.rows
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
