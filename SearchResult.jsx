import React, {Component} from 'react';
import SearchResultRow from './SearchResultRow.jsx';
import Pagination from './Pagination.jsx';

const get = (haystack, needle, spoon) => haystack[needle] || spoon;
const invertDirection = d => get({
  ASC: "DESC",
  DESC: "ASC"
}, d, "ASC");

function SortHeader(props) {
  let {field, direction, colName} = props,
    className = (field === colName)
      ? "orderField orderField--" + direction
      : "",
    onChangeOrder = props.onChangeOrder,
    onClick = evt => {
      evt.preventDefault();
      let newDirection = (field === colName)
         ? invertDirection(direction.trim())
         : "ASC";
      onChangeOrder(colName, newDirection);
    };
  return <a href="#" className={className} onClick={onClick}>{colName}</a>;
};

function ColumnHeader(props) {
  let content = (props.resultsCount > 0)
    ? <SortHeader {...props.order} colName={props.colName}/>
    : props.colName;
  return (
    <th style={{ textTransform: 'capitalize' }}>
      {content}
    </th>
  );
}

export default function SearchResult(props) {
  let {
    cols,
    rows,

    limit = 20,
    offset = 0,
    total,

    onPaginate,
    onChangeOrder,

    orderField,
    orderDirection
  } = props;

  let pagination = {
    onPaginate,
    limit,
    offset,
    total,
    count: rows.length || 0
  };
  let order = {
    field: orderField,
    direction: orderDirection,
    onChangeOrder
  };

  let data_ths = cols.map((col, i) => <ColumnHeader key={i} colName={col} order={order} resultsCount={rows.length}/>);

  // @TODO let action_ths = actions.map((action,i) => <th key={i}>{action}</th>); then render after data_ths

  let noResultsText = 'Sin resultados',
    noResultsRow = (
      <tr>
        <td colSpan={cols.length} className="text-center">
          <span className="text-muted">{noResultsText}</span>
        </td>
      </tr>
    );

  let data_rows = rows.length
    ? rows.map((row, i) => <SearchResultRow row={i} key={i} cols={row} displayCols={cols}/>)
    : noResultsRow;
  return (
    <div>
      <Pagination {...pagination}/>
      <table className="table table-stripped table-bordered table-hover">
        <thead>
          <tr>{data_ths}</tr>
        </thead>
        <tbody>{data_rows}</tbody>
      </table>
    </div>
  );
}
