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
        this.src = props.src;
        this.state = {
            data: [],
            cols: [],
            total: 0,
            limit: 20,
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
        let onPaginate = (limit, offset) => {
            // @TODO there's no need for limit here, I think
            this.setState({limit, offset}, this.loadResults);
        }
        let onChangeOrder = (orderField, orderDirection) => {
            this.setState({
                orderField, orderDirection
            }, this.loadResults);
        };
        return (
            <div>
                <div className="well">
                    <SearchForm onSubmit={formSubmit} />
                </div>
                <SearchResult
                    onNext={onPaginate}
                    onPrev={onPaginate}
                    onChangeOrder={onChangeOrder}

                    limit={this.state.limit}
                    offset={this.state.offset}
                    orderField={this.state.orderField}
                    orderDirection={this.state.orderDirection}

                    total={this.state.total}
                    cols={this.state.cols}
                    rows={this.state.data} />
            </div>
        );
    }
}
