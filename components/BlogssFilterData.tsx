import React, { useState } from "react";
import styles from "./DataTable.module.scss";
import BlogsTable from "./BlogsTable";

const BlogsFilterData = ({ data, deleteItem }) => {
    const [filteredData, setFilteredData] = useState("");

    function filteration(data, value) {
        const newarr = data.filter((item) => {
            if (!value) return true;
            if (
                item.title.toLowerCase().includes(value.toLowerCase()) ||
                item.longDesc.toLowerCase().includes(value.toLowerCase()) ||
                item.tag.toLowerCase().includes(value.toLowerCase())
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
            <BlogsTable data={filteration(data, filteredData)} deleteItem={deleteItem} />
        </>
    );
};

export default BlogsFilterData;
