// Import required AWS SDK clients and commands for Node.js.
import { useEffect, useState } from "react";
import { ddbDocClient } from "../../util/ddbDocClient";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Link from "next/link";
import BlogsFilterData from "../../components/BlogssFilterData";

const Styles = {
  tableHeadings:
    "border-b bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900 max-w-100",
  tableData: "text-sm text-gray-900 font-light max-w-100",
};

const ViewData = () => {

  let data: any = [];
  const [tableData, setTableData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  //   scanning the dynamodb table
  const getCategories = async () => {
    try {
      const params = {
        TableName: 'Deals',
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'CATEGORIES'
        }
      }
      const cdata = await ddbDocClient.send(new ScanCommand(params));
      setCategoriesData(cdata.Items);
      console.log("cdata", cdata.Items);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);


  //   scanning the dynamodb table
  const scanTable = async () => {
    try {
      const params = {
        TableName: 'Deals',
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'BLOG#'
        }
      }
      data = await ddbDocClient.send(new ScanCommand(params));
      setTableData(data.Items);
      console.log("success", data.Items);
    } catch (err) {
      console.log("Error", err);
    }
  };

  //   deleting an item from the table
  const deleteItem = async (primaryKeyValue: any, sortKeyValue: any) => {
    try {
      // setting up the parameters for UpdateCommand
      const params = {
        TableName: "Deals",
        Key: {
          pk: primaryKeyValue, //primaryKey
          sk: sortKeyValue, //sortKey (if any)
        },
        UpdateExpression:
          "set blogstatus = :p, dateModified = :k",
        ExpressionAttributeValues: {
          ":p": "deleted",
          ":k": new Date().toLocaleString()
        },
      };
      const data = await ddbDocClient.send(new UpdateCommand(params));
      console.log("Success - updated", data);
      alert('Soft Deleted Successfully')
      /*await ddbDocClient.send(
        new DeleteCommand({
          TableName: "Deals",
          Key: {
            id: primaryKeyValue,
            dateAdded: sortKeyValue,
          },
        })
      );
      console.log("Success - item deleted");*/
      scanTable();
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    scanTable();
  }, []);

  return (
    <>

      <div className="container mx-auto py-10 flex flex-col w-screen h-screen items-center">
        <div className="flex w-2/3 justify-end py-4">
          <Link
            href={{
              pathname: "/blogs/add",
            }}
          >
            <button
              type="button"
              className="inline-block px-6 py-2.5 mr-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >Add Blogs</button>
          </Link>
        </div>
        <p className="text-3xl">Blog Enteries</p>
        <div className="w-11/12">
              <BlogsFilterData data={tableData} categoriesData={categoriesData} deleteItem={deleteItem}/>
        </div>
      </div>
    </>
  );
};

export default ViewData;
