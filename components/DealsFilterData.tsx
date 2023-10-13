import React, { useState } from "react";
import DealsTable from "./DealsTable";
import styles from "./DataTable.module.scss";

const DealsFilterData = ({ data, brandsData, categoriesData, storesData, deleteItem }) => {
    const [filteredData, setFilteredData] = useState("");

    function filteration(data, value) {
        const newarr = data.filter((item) => {
            if (!value) return true;
            if (
                item.textLink.toLowerCase().includes(value.toLowerCase()) ||
                item.title.toLowerCase().includes(value.toLowerCase()) ||
                item.submittedby.toLowerCase().includes(value.toLowerCase()) ||
                item.description.toLowerCase().includes(value.toLowerCase()) ||
                item.image.toLowerCase().includes(value.toLowerCase()) ||
                item.listprice.toLowerCase().includes(value.toLowerCase()) ||
                item.dealprice.toLowerCase().includes(value.toLowerCase()) ||
                item.storename.toLowerCase().includes(value.toLowerCase()) ||
                item.brandname.toLowerCase().includes(value.toLowerCase()) ||
                item.category.toLowerCase().includes(value.toLowerCase()) ||
                item.dateAdded.toLowerCase().includes(value.toLowerCase()) ||
                item.dateModified.toLowerCase().includes(value.toLowerCase()) ||
                item.expiredon.toLowerCase().includes(value.toLowerCase())
            ) {
                return true;
            }
            return false;
        });
        return newarr;
    }

    return (
        <>
            <div className={styles.search}>
                <span className={styles.searchLabel}>Search: </span>
                <input
                    className={styles.inputlabel}
                    type="text"
                    value={filteredData}
                    onChange={(e) => setFilteredData(e.target.value)}
                />
            </div>
            <DealsTable data={filteration(data, filteredData)} brandsData={brandsData} storesData={storesData} categoriesData={categoriesData} deleteItem={deleteItem} />
        </>
    );
};

export default DealsFilterData;
