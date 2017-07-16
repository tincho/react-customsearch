import React from 'react';

const firstAndLastPage = ({currentPage, max, pages}) => {
    let result = [];
    //result = [1, pages];
    return result;
};
const getOffset = (lim, p) => lim * Math.max(p - 1, 0);
const getPage = (lim, o) => 1 + Math.ceil(o / lim);

export default function Pagination({offset, count, total, limit, onPaginate})  {
    offset = parseInt(offset, 10);

    // @TODO extract PaginationLink and make one ad-hoc partially applying to it limit and offset
    // this way we're getting rid of the closure coupling
    const PaginationLink = ({page, text, onClick}) => {
        let newOffset = getOffset(limit, page),
            isCurrent = !text && count > 0 && newOffset === offset;
        return <li className={isCurrent && 'active'}>
            <a onClick={ () => onClick(newOffset) } className={isCurrent && 'disabled'} href="#">{text || page}</a>
        </li>;
    }

    let pages = Math.floor(total / limit) + 1,
        currentPage = getPage(limit, offset),
        prevPage = Math.max(1, currentPage - 1),
        nextPage = Math.min(pages, currentPage + 1);
    let [firstPage = 1, lastPage = pages] = firstAndLastPage({pages, currentPage, max: 5});

    let pageButtons = [];
    for (let page = firstPage; page <= lastPage; page++) {
        let btnProps = { page, onClick: onPaginate, key: page };
        pageButtons.push(<PaginationLink {...btnProps} />);
    }

    let controls = count > 0
        ?         <ul className="pagination">
                    <PaginationLink text="&laquo;" onClick={onPaginate} page="1" />
                    <PaginationLink text="&lsaquo;" onClick={onPaginate} page={prevPage} />
                    {pageButtons}
                    <PaginationLink text="&rsaquo;" onClick={onPaginate} page={nextPage} />
                    <PaginationLink text="&raquo;" onClick={onPaginate} page={pages} />
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
