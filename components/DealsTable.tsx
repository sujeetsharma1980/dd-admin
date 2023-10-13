import React, { useState } from "react";
import { useSortableData } from "./hooks";
import ReactPaginate from "react-paginate";
import styles from "./DataTable.module.scss";
import Link from "next/link";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";

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
  const PER_PAGE = 50;
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
                Title & link
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
              <button type="button" onClick={() => requestSort("brandname")} className={`${styles.theadbtn} ${getClassNamesFor("brandname")}`}>
                Brand
              </button>
            </th>
            <th className={styles.thbackgroundcolorlightgray}>
              <button type="button" onClick={() => requestSort("store")} className={`${styles.theadbtn} ${getClassNamesFor("store")}`}>
                Store
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
                <td className={styles.tabledata+ ' text-sm font-medium'}>
                  <Link target='_blank' href={item.textLink}>{item.textLink}</Link>
                  <div>{item.title}</div>
                </td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>
                  <img src={item.image} className={styles.imgclass}/>
                </td>
                <td className={styles.tabledata + ' text-sm font-medium'}>{item.listprice}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{item.dealprice}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{(props.brandsData.find(brand => brand.sk === item.brandname))?.brandname}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{(props.storesData.find(store => store.sk === item.storename))?.storename}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{(props.categoriesData.find(category => category.sk === item.category))?.categoryname}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{item.dateAdded}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{item.dateModified}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{item.expiredon}</td>
                <td className={styles.tabledata+ ' text-sm font-medium'}>{item.deleted}</td>
                <td className={styles.tableactiondata+ ' text-sm font-medium'}>
                  <Link
                    href={{
                      pathname: "/deals/update",
                      query: {
                        pk: item.pk,
                        sk: item.sk,
                        title: item.title,
                        dateAdded: item.dateAdded,
                        brandname: item.brandname,
                        category: item.category,
                        storename: item.storename,
                        image: item.image,
                        textLink: item.textLink,
                        description: item.description,
                        listprice: item.listprice,
                        dealprice: item.dealprice,
                        submittedby: item.submittedby,
                        deleted: item.deleted,
                        expiredon: item.expiredon
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

export default DealsTable;
