import React, {Component} from 'react';
import SearchResultRow from './SearchResultRow.jsx';
import Pagination from './Pagination.jsx';

const get = (haystack, needle, spoon) => haystack[needle] || spoon;
const invertDirection = d => get({ ASC: "DESC", DESC: "ASC" }, d, "ASC");

function ColumnHeader(props) {
    let order = props.currentOrder;
    let onClick = evt => {
        evt.preventDefault();
        order.field = props.colName;
        if (order.field === props.colName) {
            order.direction = invertDirection(order.direction.trim());
        }
        props.onChangeOrder(order.field, order.direction);
    };

    let className = (order.field === props.colName) ? "orderField " + "orderField--" + order.direction : "";

    return (props.enableOrder) ? <a href="#" onClick={onClick} className={className}>{props.colName}</a> : <span>{props.colName}</span>;
};

export default class SearchResult extends Component {

    render() {
        let {cols, rows} = this.props;
        let {limit = 20, offset = 0, total, onNext, onPrev, onChangeOrder, orderField, orderDirection } = this.props;
        let pagination = { onPrev, onNext, limit, offset, total, count: rows.length || 0 };
        let currentOrder = { field: orderField, direction: orderDirection };

        let data_ths   = cols.map(
            (col, i) =>  <th key={i} style={{ textTransform: 'capitalize' }}>
                <ColumnHeader enableOrder={rows.length > 0} currentOrder={currentOrder} onChangeOrder={onChangeOrder} colName={col} />
            </th>);
        let action_ths = '';// actions.map((action,i) => <th key={i}>{action}</th>); ...in the future
        // let header_row = <tr>{data_ths}{action_ths}</tr>;
        let header_row = <tr>{data_ths}</tr>;

        let noResultsText = 'Sin resultados',
            noResultsRow  = (<tr><td colSpan={cols.length} className="text-center">
                    <span className="text-muted">{noResultsText}</span>
                </td></tr>);

        let data_rows = rows.length
            ? rows.map((row, i) => <SearchResultRow row={i} key={i} cols={row} displayCols={cols} />)
            : noResultsRow;
        return (
            <div>
                <Pagination {...pagination} />
                <table className="table table-stripped table-bordered table-hover">
                    <thead>{header_row}</thead>
                    <tbody>{data_rows}</tbody>
                </table>
            </div>
        );
    }
}
