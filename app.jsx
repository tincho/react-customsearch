import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import fetchJSON from './Helpers/fetchJson.js';

import SearchForm from './SearchForm.jsx';
import SearchResult from './SearchResult.jsx';
// import Pagination from './Pagination.jsx';

var $$ = document.querySelector.bind(document);
// var serialize = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

export default class SearchApp extends React.Component {

    constructor(props) {
        super(props);
        this.src = props.options.src;
        this.columnNames = props.options.columnNames;

        this.state = {
            data: [],
            cols: [],
            total: 0,
            limit: props.options.limit || 20,
            offset: 0,
            orderField: "",
            orderDirection: ""
        };
    }

    componentWillMount() {
        this.loadColumns();
    }

    loadColumns() {
        fetchJSON(this.src + 'columns/selected').then(cols => this.setState({cols}));
    }

    loadResults() {
        let
            thisNode = ReactDOM.findDOMNode(this),
            $$       = thisNode.querySelector.bind(thisNode);

        // @TODO get these 2 values from SearchForm somehow
        var q = $$("input[name=q]").value;
        var type = ($$("input[name=type]:checked") || {
            value: 'any'
        }).value;

        // this.setState({ loading: true });
        // COMMENTED because triggers render !
        // @TODO ...SearchResult is loading its data!

        const queryString = params => Object.keys(params).reduce((str, key) => str + `${key}=${params[key]}&`, "").replace(/\&$/, '');

        let { limit, offset, orderField, orderDirection } = this.state;

        let params = {
            q, type, limit, offset
        };
        let order = orderField + " " + orderDirection;
        if (order.replace(" ", "") !== "") {
            params.order = order;
        }
        console.log(params);

        fetchJSON(this.src + `search?${queryString(params)}`).then(data => this.setState({
            loading: false,
            total: data.count,
            limit: data.limit,
            offset: data.offset,
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
                    <SearchForm onSubmit={formSubmit} />
                </div>
                <SearchResult
                    onPaginate={onPaginate}
                    onChangeOrder={onChangeOrder}

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
