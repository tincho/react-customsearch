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

function PageLink(limit, currentOffset, {page, text, onClick, disabled}) {
  let newOffset = getOffset(limit, page),
      isCurrent = !text && newOffset === currentOffset;
  return (<li className={disabled && 'disabled' || isCurrent && 'active'}>
      <a onClick={ () => onClick(newOffset) } className={(isCurrent || disabled) && 'disabled'} href="#">{text || page}</a>
  </li>);
}

function PageNumbers({firstPage, lastPage, pages, PaginationLink, onPaginate}) {
  let pageButtons = [], hellip = <li className="disabled"><a>&hellip;</a></li>;
  for (let page = firstPage; page <= lastPage; page++) {
      let moreBefore = (page > 1),
          moreAfter  = (pages > lastPage);
      if (page == firstPage && moreBefore && !moreAfter)  {
           pageButtons.push(hellip)
      }

      let btnProps = { page, onClick: onPaginate, key: page };
      pageButtons.push(<PaginationLink {...btnProps} />);

      if ( page == lastPage && moreAfter ) {
          pageButtons.push(hellip)
      }
  }
  return pageButtons;
}

export default function Pagination(props) {
    let {total, limit} = props,
        pages = Math.floor(total / limit) + 1;

    if (pages <= 1) {
      return;
    }

    let
      {offset, count, onPaginate} = props,
      current = getPage(limit, offset),
      prev = Math.max(1, current - 1),
      next = Math.min(pages, current + 1);

    const PaginationLink = props => PageLink(limit, offset, props);

    let [firstPage = 1, lastPage = pages] = firstAndLastPage({pages, current, side: 2});

    let pageButtons = PageNumbers({firstPage, lastPage, pages, PaginationLink, onPaginate});

    return (
        <div>
          <ul className="pagination">
            <PaginationLink text="&laquo;" onClick={onPaginate} page="1" disabled={current === 1} />
            <PaginationLink text="&lsaquo;" onClick={onPaginate} page={prev} disabled={current === 1} />
            {pageButtons}
            <PaginationLink text="&rsaquo;" onClick={onPaginate} page={next} disabled={current === pages} />
            <PaginationLink text="&raquo;" onClick={onPaginate} page={pages} disabled={current === pages} />
          </ul>
        </div>
      );
}
