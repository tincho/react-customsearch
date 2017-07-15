import React from 'react';

// @TODO get rid of Prev and Next, use only PaginationLink (figure out the prev and next page instead of prev and next offset) 

function Prev({total, count,  offset = 0, onPaginate, limit}) {
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    let btn = <a className="btn disabled">&lsaquo;</a>;
    if (offset >= limit) {
        let onClick = (ev) => {
            ev.preventDefault();
            onPaginate(offset - limit);
        }
        btn = <a className="btn" onClick={onClick}>&lsaquo;</a>;
    }
    return <li>{btn}</li>;
}

function Next({total, count, offset = 0, onPaginate, limit}) {
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    let btn = <a className="btn disabled">&rsaquo;</a>;
    if (total > count + offset) {
        let onClick = (ev) => {
            ev.preventDefault();
            onPaginate(offset + limit);
        }
        btn = <a className="btn" onClick={onClick}>&rsaquo;</a>;
    }
    return <li>{btn}</li>;
}

export default function Pagination({offset, count, total, limit, onPaginate})  {
    //let page = 1;
    offset = parseInt(offset, 10);
    let resume = count > 0
        ? (offset + 1) + ' - ' + (offset + count) + ' / ' + total
        : '';

    const pageOffset = (lim, p) => lim * Math.max(p - 1, 0);

    const PaginationLink = ({page, text, onPaginate}) => {
        let newOffset = pageOffset(limit, page),
            isCurrent = !text && count > 0 && newOffset === offset;
        return <li className={isCurrent ? 'active': ''}>
            <a onClick={ () => onPaginate(newOffset) }>{text || page}</a>
        </li>;
    }

    let pageButtons = [];
    let pages = Math.floor(total / limit) + 1;
    for (let page = 1; page <= pages; page++) {
        pageButtons.push(<PaginationLink key={page} onPaginate={onPaginate} page={page} />);
    }

    let props = {offset, count, total, limit, onPaginate};

    let controls = count > 0
        ?         <ul className="pagination">
                    <PaginationLink text="&laquo;" onPaginate={onPaginate} page="1" />
                    <Prev {...props} />
                    {pageButtons}
                    <Next {...props} />
                    <PaginationLink text="&raquo;" onPaginate={onPaginate} page={pages} />
                </ul>
        : '';

    return <div>
        {resume}<br />
        {controls}
    </div>;
}
