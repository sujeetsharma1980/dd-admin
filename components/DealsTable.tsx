import React, { useState } from "react";
import { useSortableData } from "./hooks";
import ReactPaginate from "react-paginate";
import styles from "./DataTable.module.scss";
import Link from "next/link";

const DealsTable = (props) => {
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
              <button type="button" onClick={() => requestSort("description")} className={`${styles.theadbtn} ${getClassNamesFor("description")}`}>
              Deal Link & Description
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("image")} className={`${styles.theadbtn} ${getClassNamesFor("image")}`}>
                Image
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" onClick={() => requestSort("listprice")} className={`${styles.theadbtn} ${getClassNamesFor("listprice")}`}>
                List Price
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("dealprice")} className={`${styles.theadbtn} ${getClassNamesFor("dealprice")}`}>
                Deal Price
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" onClick={() => requestSort("source")} className={`${styles.theadbtn} ${getClassNamesFor("source")}`}>
                Source
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
                Date Modified
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" onClick={() => requestSort("expiredon")} className={`${styles.theadbtn} ${getClassNamesFor("expiredon")}`}>
                Expired on
              </button>
            </th>
            <th className={styles.thbackgroundcolordarkgray}>
              <button type="button" onClick={() => requestSort("deleted")} className={`${styles.theadbtn} ${getClassNamesFor("deleted")}`}>
                Deleted
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
                  <Link target='_blank' href={item.textLink}>{item.textLink}</Link>
                  <div>{item.description}</div>
                </td>
                <td className={styles.tabledata}>
                  <img src={item.image} width={300} height={300}/>
                </td>
                <td className={styles.tabledata}>{item.listprice}</td>
                <td className={styles.tabledata}>{item.dealprice}</td>
                <td className={styles.tabledata}>{(props.brandsData.find(brand => brand.sk === item.dealsource))?.brandname}</td>
                <td className={styles.tabledata}>{(props.categoriesData.find(category => category.sk === item.category))?.categoryname}</td>
                <td className={styles.tabledata}>{item.dateAdded}</td>
                <td className={styles.tabledata}>{item.dateModified}</td>
                <td className={styles.tabledata}>{item.expiredon}</td>
                <td className={styles.tabledata}>{item.deleted}</td>
                <td>
                  <Link
                    href={{
                      pathname: "/deals/update",
                      query: {
                        pk: item.pk,
                        sk: item.sk,
                        dateAdded: item.dateAdded,
                        dealsource: item.dealsource,
                        category: item.category,
                        image: item.image,
                        textLink: item.textLink,
                        description: item.description,
                        listprice: item.listprice,
                        dealprice: item.dealprice,
                        deleted: item.deleted,
                        expiredon: item.expiredon
                      },
                    }}
                  >
                    <button
                      type="button"
                      className="inline-block px-6 py-2.5 mr-2 
                            bg-blue-600 text-white font-medium text-xs 
                            leading-tight uppercase rounded shadow-md 
                            hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
                            focus:shadow-lg focus:outline-none 
                            focus:ring-0 active:bg-blue-800 active:shadow-lg 
                            transition duration-150 ease-in-out"
                    >Edit</button>
                  </Link>
                  <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-red-600 
                          text-white font-medium text-xs leading-tight 
                          uppercase rounded shadow-md hover:bg-red-700 
                          hover:shadow-lg focus:bg-red-700 focus:shadow-lg 
                          focus:outline-none focus:ring-0 active:bg-red-800 
                          active:shadow-lg transition duration-150 ease-in-out"
                    onClick={() => props.deleteItem(item.pk, item.sk)}
                  >Delete</button>
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

export default DealsTable;