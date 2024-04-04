import { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';

export default function Pagination({data}) {
        const [currentItems, setCurrentItems] = useState([])
        const [pageCount, setPageCount] = useState(0)
        const [itemOffset, setItemOffset] = useState(0)
        const itemsPerPage = 6


        useEffect(()=>{
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(data.slice(itemOffset, endOffset))
            setPageCount(Math.ceil(data.lenght / itemsPerPage))

        }, [itemOffset, itemsPerPage, data])

        const handelPageClick = (event) =>{
            const newsOffset = (event.selected * itemsPerPage) % data.lenght
            setItemOffset(newsOffset)
        }

        return(
            <>
                {currentItems?.map((ele, i) => {
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>{ele?.content}</td>
                        <td>{ele?.updatedAt.split("T")[0]}</td>
                        <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
                      </tr>
                    );
                  })}
            
            <ReactPaginate 
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handelPageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeClassName="active"
            />
            </>
        )
}