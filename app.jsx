import React, {Component} from 'react';

import fetchJSON from './Helpers/fetchJson.js';

import SearchForm from './SearchForm.jsx';
import SearchResult from './SearchResult.jsx';
// var serialize = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

export default class SearchApp extends Component {

    constructor(props) {
        super(props);
        this.form = {};
        this.src = props.options.src;
        this.columnNames = props.options.columnNames;
        this.fieldFormatters = props.options.fieldFormatters;

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
    }

    loadColumns() {
        this.triggerEvt("loading columns");
        fetchJSON(this.src + 'columns/selected')
          .then(cols => this.setState({cols}, () => {
            this.triggerEvt("columns are set in state");
          }));
    }

    loadResults() {
        const queryString = params => Object.keys(params).reduce((str, key) => str + `${key}=${params[key]}&`, "").replace(/\&$/, '');
        const get = (haystack, needle, spoon) => haystack[needle] || spoon;

        let
          { q, type } = this.form;
        q = q.value;
        type = get(Array.from(type).find(i => i.checked), 'value', 'any');

        let
          { limit, offset, orderField, orderDirection } = this.state,
          order = orderField + " " + orderDirection,
          previousType = this.state.type,
          params = { q, type, limit, offset: (type === previousType) ? offset : 0 };

        // conditionally add order:
        if (order.replace(" ", "") !== "") {
            params.order = order;
        }

        this.triggerEvt("will load: " + queryString(params));

        fetchJSON(this.src + `search?${queryString(params)}`).then(data => this.setState({
            q, type,
            loading: false,
            total: data.count,
            //limit: data.limit,
            offset: params.offset,
            data: data.rows
        }));
    }

    render() {
        // @TODO implement REDUX pattern (and library)
        let formSubmit = (evt) => {
            evt.preventDefault();
            this.setState({
                offset: 0,
                orderField: "",
                orderDirection: ""
            }, this.loadResults)
        };
        let onPaginate = (offset) => {
            this.setState({offset}, this.loadResults);
        }
        let onChangeOrder = (orderField, orderDirection) => {
            this.setState({
                offset: 0, // always reset to first page
                orderField, orderDirection
            }, this.loadResults);
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
