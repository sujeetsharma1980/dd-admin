import React, { useState } from "react";
import { useSortableData } from "./hooks";
import ReactPaginate from "react-paginate";
import styles from "./DataTable.module.scss";
import Link from "next/link";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";

const BlogsTable = (props) => {
  const [currentPage, setCurrentPage] = useState(0); //Pagination

  const { items, requestSort, sortConfig } = useSortableData(props.data);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : null;
  };

  // Pagination
  const PER_PAGE = 5;
  const pageCount = Math.ceil(items.length / PER_PAGE);
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  const offset = currentPage * PER_PAGE;

  return (
    <>
      <table className={styles.datatable}>
        <thead className={styles.datatablethead}>
          <tr>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("slug")} className={`${styles.theadbtn} ${getClassNamesFor("slug")}`}>
                Slug
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("title")} className={`${styles.theadbtn} ${getClassNamesFor("title")}`}>
                Title
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("tag")} className={`${styles.theadbtn} ${getClassNamesFor("tag")}`}>
                Tag
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("category")} className={`${styles.theadbtn} ${getClassNamesFor("category")}`}>
                Category
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" onClick={() => requestSort("dateAdded")} className={`${styles.theadbtn} ${getClassNamesFor("dateAdded")}`}>
                Date Added
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("dateModified")} className={`${styles.theadbtn} ${getClassNamesFor("dateModified")}`}>
                Date Published
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" onClick={() => requestSort("blogstatus")} className={`${styles.theadbtn} ${getClassNamesFor("blogstatus")}`}>
                Status
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" className={`${styles.theadbtn} ${getClassNamesFor("deleted")}`}>
                Action
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className={styles.tablerow}>
              <td className={styles.tabledata}>
                No matching records found
              </td>
            </tr>
          ) : (
            items.slice(offset, offset + PER_PAGE).map((item, index) => (
              <tr key={index} className={styles.tablerow}>
                <td className={styles.tabledata}>
                  <div>{item.slug}</div>
                </td>
                <td className={styles.tabledata}>{item.title}</td>
                <td className={styles.tabledata}>{item.tag}</td>
                <td className={styles.tabledata}>{(props.categoriesData.find(category => category.sk === item.category))?.categoryname}</td>
                <td className={styles.tabledata}>{item.dateAdded}</td>
                <td className={styles.tabledata}>{item.dateModified}</td>
                <td className={styles.tabledata}>{item.blogstatus}</td>
                <td className={styles.tableactiondata}>
                  <Link
                    href={{
                      pathname: "/blogs/update",
                      query: {
                        pk: item.pk,
                        sk: item.sk,
                        dateAdded: item.dateAdded,
                        category: item.category,
                        title: item.title,
                        tag: item.tag,
                        slug: item.slug,
                        blogstatus: item.blogstatus,
                        image: item.image,
                        longDesc: item.longDesc
                      },
                    }}
                  >
                    <PencilSquareIcon color="green" className="w-6 h-6 inline-block" />
                  </Link>
                  <XCircleIcon className="w-6 h-6 inline-block" color="red" onClick={() => props.deleteItem(item.pk, item.sk)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={styles.datatablefooter}>
        <div className={styles.datatableshowing}>
          <span>
            Showing {offset + 1} to {offset + PER_PAGE} of {items.length}{" "}
            entries
          </span>
        </div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={styles.pagination}
          previousLinkClassName={styles.paginationLink}
          nextLinkClassName={styles.paginationLink}
          disabledClassName={styles.paginationDisabled}
          activeClassName={styles.paginationActive}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
        />
      </div>
    </>
  );
};

export default BlogsTable;
