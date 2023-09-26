// Import required AWS SDK clients and commands for Node.js.
import { useEffect, useState } from "react";
import { ddbDocClient } from "../../config/ddbDocClient";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Link from "next/link";

const Styles = {
  tableHeadings:
    "text-sm font-medium text-gray-900 px-6 py-4 text-left border-2",
  tableData: "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap",
};

const ViewData = () => {

  let data: any = [];
  const [tableData, setTableData] = useState([]);

  const [brandsData, setBrandsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    getBrands();
    getCategories();
  }, []);

  //   scanning the dynamodb table
  const getBrands = async () => {
    try {
      const params = {
        TableName: 'Deals',
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'BRANDS'
        }
      }
      const bdata = await ddbDocClient.send(new ScanCommand(params));
      setBrandsData(bdata.Items);
      console.log("bdata", bdata.Items);
    } catch (err) {
      console.log("Error", err);
    }
  };

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

  //   scanning the dynamodb table
  const scanTable = async () => {
    try {
      const params = {
        TableName: 'Deals',
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'P#'
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
          "set deleted = :p, dateModified = :k",
        ExpressionAttributeValues: {
          ":p": "y",
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
              pathname: "/deals/add",
            }}
          >
            <button
              type="button"
              className="inline-block px-6 py-2.5 mr-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >Add Deals</button>
          </Link>
        </div>
        <p className="text-3xl">Deals</p>
        <div className="flex flex-col w-2/3 py-10">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden bg-white">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th scope="col" className={Styles.tableHeadings}>Deal Link</th>
                      <th scope="col" className={Styles.tableHeadings}>Description</th>
                      <th scope="col" className={Styles.tableHeadings}>Image</th>
                      <th scope="col" className={Styles.tableHeadings}>List Price</th>
                      <th scope="col" className={Styles.tableHeadings}>Deal Price</th>
                      <th scope="col" className={Styles.tableHeadings}>Source</th>
                      <th scope="col" className={Styles.tableHeadings}>Category</th>
                      <th scope="col" className={Styles.tableHeadings}>Date Added</th>
                      <th scope="col" className={Styles.tableHeadings}>Date Modified</th>
                      <th scope="col" className={Styles.tableHeadings}>Expired On</th>
                      <th scope="col" className={Styles.tableHeadings}>Soft Deleted</th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-center border-2"
                      >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item: any) => (
                      <tr className="border-b" key={item.pk}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.textLink}
                        </td>
                        <td className={Styles.tableData}>{item.description}</td>
                        <td className={Styles.tableData}>{item.image}</td>
                        <td className={Styles.tableData}>{item.listprice}</td>
                        <td className={Styles.tableData}>{item.dealprice}</td>
                        <td className={Styles.tableData}>{(brandsData.find(brand => brand.sk === item.dealsource))?.brandname}</td>
                        <td className={Styles.tableData}>{(categoriesData.find(category => category.sk === item.category))?.categoryname}</td>
                        <td className={Styles.tableData}>{item.dateAdded}</td>
                        <td className={Styles.tableData}>{item.dateModified}</td>
                        <td className={Styles.tableData}>{item.expiredon}</td>
                        <td className={Styles.tableData}>{item.deleted}</td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
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
                            onClick={() => deleteItem(item.pk, item.sk)}
                          >Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewData;
