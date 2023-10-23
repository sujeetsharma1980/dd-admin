import React, { useState } from "react";
import DealsTable from "./DealsTable";
import styles from "./DataTable.module.scss";

const DealsFilterData = ({ data, brandsData, categoriesData, storesData, deleteItem }) => {
    const [filteredData, setFilteredData] = useState("");
    const [selected, setSelected] = useState("");
    console.log(`Option selecteds:`, selected);

    function filteration(data, searchKey, selected?) {
        const newarr = data.filter((item) => {
            console.log('item.popular' + typeof(item.popular))
            const searchKeyCheck = (item.textLink.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.title.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.submittedby.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.description.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.image.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.listprice.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.dealprice.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.storename.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.brandname.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.category.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.dateAdded.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.dateModified.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.expiredon.toLowerCase().includes(searchKey.toLowerCase()));

            const isActiveCondition = selected === 'active' ? (new Date(item.expiredon) > new Date()) : true;
            const isExpiredCondition = selected === 'expired' ? (new Date(item.expiredon) < new Date()) : true;
            const isPopularCondition = selected === 'popular' ? (item.popular) : true;
            const isExclusiveCondition = selected === 'exclusiveone' ? (item.exclusiveone) : true;
            const isFeaturedCondition = selected === 'featured' ? (item.featured) : true;
            const isDeletedCondition = selected === 'deleted' ? (item.deleted === 'y') : true;
            const searchKeyCondition = !searchKey ? true : searchKeyCheck;


            if (isActiveCondition
                && isExpiredCondition
                && isPopularCondition
                && isExclusiveCondition
                && isFeaturedCondition
                && isDeletedCondition
                && searchKeyCondition
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
                <br />
                <br />
                Filter : 
                <select id="dealstatus" onChange={(e) =>  setSelected(e.target.value)}>
                    <option value='all' key='all'>All</option>
                    <option value='active' key='active'>Active</option>
                    <option value='expired' key='expired'>Expired</option>
                    <option value='deleted' key='deleted'>Deleted</option>
                    <option value='popular' key='popular'>Popular</option>
                    <option value='exclusiveone' key='exclusiveone'>Exclusive</option>
                    <option value='featured' key='featured'>Featured</option>
                </select>
                <br />
                <br />
            </div>
            <DealsTable data={filteration(data, filteredData, selected)} brandsData={brandsData} storesData={storesData} categoriesData={categoriesData} deleteItem={deleteItem} />
        </>
    );
};

export default DealsFilterData;
