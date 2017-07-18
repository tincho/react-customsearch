import React from 'react';

const firstAndLastPage = ({current, side, pages}) => {
    let
        pWindow = 2 * side,
        first = Math.max(1, Math.min(current - side, pages - pWindow)),
        last  = Math.min(pages, first + pWindow);
    return [ first, last ];
}

const getOffset = (lim, p) => lim * Math.max(p - 1, 0);
const getPage = (lim, o) => 1 + Math.ceil(o / lim);

export default function Pagination({offset, count, total, limit, onPaginate})  {
    offset = parseInt(offset, 10);

    // @TODO extract PaginationLink and make one ad-hoc partially applying to it:
    // limit, offset, count
    // this way we're getting rid of the closure coupling
    const PaginationLink = ({page, text, onClick, disabled}) => {
        let newOffset = getOffset(limit, page),
            isCurrent = !text && count > 0 && newOffset === offset;
        onClick = disabled ? () => {} : onClick;
        return <li className={disabled && 'disabled' || isCurrent && 'active'}>
            <a onClick={ () => onClick(newOffset) } className={(isCurrent || disabled) && 'disabled'} href="#">{text || page}</a>
        </li>;
    }

    let pages = Math.floor(total / limit) + 1,
        current = getPage(limit, offset),
        prev = Math.max(1, current - 1),
        next = Math.min(pages, current + 1);
    let [firstPage = 1, lastPage = pages] = firstAndLastPage({pages, current, side: 2});

    let pageButtons = [], hellip = <li className="disabled"><a>&hellip;</a></li>;
    for (let page = firstPage; page <= lastPage; page++) {
        let moreBefore = ( page > 1),
            moreAfter  = ( pages > lastPage );
        if (page == firstPage && moreBefore && !moreAfter)  {
             pageButtons.push(hellip)
        }

        let btnProps = { page, onClick: onPaginate, key: page };
        pageButtons.push(<PaginationLink {...btnProps} />);

        if ( page == lastPage && moreAfter ) {
            pageButtons.push(hellip)
        }
    }

    let controls = count > 0
        ?         <ul className="pagination">
                    <PaginationLink text="&laquo;" onClick={onPaginate} page="1" disabled={current === 1} />
                    <PaginationLink text="&lsaquo;" onClick={onPaginate} page={prev} disabled={current === 1} />
                    {pageButtons}
                    <PaginationLink text="&rsaquo;" onClick={onPaginate} page={next} disabled={current === pages} />
                    <PaginationLink text="&raquo;" onClick={onPaginate} page={pages} disabled={current === pages} />
                </ul>
        : '';

    let resume = count > 0
        ? <small className="text-muted">{(offset + 1) + ' - ' + (offset + count) + ' / ' + total}</small>
        : '';

    return <div>
        {controls}<br />
        {resume}
    </div>;
}
