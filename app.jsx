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
            offset: 0
        };
    }

    componentWillMount() {
        this.loadColumns();
    }

    loadColumns() {
        fetchJSON(this.src + 'columns/selected').then(cols => this.setState({cols}));
    }

    loadResults(limit = 20, offset = 0) {

        let
            thisNode = ReactDOM.findDOMNode(this),
            $$       = thisNode.querySelector.bind(thisNode);

        // @TODO get these 2 values from SearchForm somehow
        var q = $$("input[name=q]").value;
        var type = ($$("input[name=type]:checked") || {
            value: 'any'
        }).value;

        this.setState({
            loading: true // @TODO ...SearchResult is loading its data!
        });

        let params = `?q=${q}&type=${type}&limit=${limit}&offset=${offset}`;
        // if(limit)
        //let pagination = serialize(this.state.pagination);
        //this.state.pagination.join()
        //if (this.state.paginaton.limit) params += '&limit=' +

        // @TODO have previous "data" and append if paginating ...
        // use Redux!
        fetchJSON(this.src + 'search' + params).then(data => this.setState({
            loading: false,
            total: data.count,
            limit: data.limit,
            offset: data.offset,
            data: data.rows
        }));
    }

    render() {
        // @TODO handle pagination via REDUX
        let formSubmit = (evt) => {
            evt.preventDefault();
            // dispatch action "SEARCH"
            return this.loadResults();
        };
        let onPaginate = (limit, offset) => {
            this.loadResults(limit, offset);
        }
        return (
            <div>
                <div className="well">
                    <SearchForm onSubmit={formSubmit} />
                </div>
                <SearchResult
                    onNext={onPaginate}
                    onPrev={onPaginate}
                    total={this.state.total}
                    limit={this.state.limit}
                    offset={this.state.offset}
                    cols={this.state.cols}
                    rows={this.state.data} />
            </div>
        );
    }
}
