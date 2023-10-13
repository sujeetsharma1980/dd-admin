// Import required AWS SDK clients and commands for Node.js.
import { useEffect, useState } from "react";
import { ddbDocClient } from "../../util/ddbDocClient";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Link from "next/link";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";

const Styles = {
  tableHeadings:
    "text-sm font-medium text-gray-900 px-2 py-2 text-left border-2",
  tableData: "text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap",
};

const ViewData = () => {

  let data: any = [];
  const [tableData, setTableData] = useState([]);

  //   scanning the dynamodb table
  const scanTable = async () => {
    try {
      const params = {
        TableName: 'Deals',
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'STORES'
        }
      }
      data = await ddbDocClient.send(new ScanCommand(params));
      setTableData(data.Items);
      //console.log("success", data.Items);
    } catch (err) {
      console.error("Error", err);
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
      //console.log("Success - updated", data);
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
      //console.log("Success - item deleted");*/
      scanTable();
    } catch (err) {
      console.error("Error", err);
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
              pathname: "/stores/add",
            }}
          >
            <button
              type="button"
              className="inline-block px-6 py-2.5 mr-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >Add Stores</button>
          </Link>
        </div>
        <p className="text-3xl">Stores</p>
        <div className="flex flex-col py-10">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="scrollit bg-white">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th scope="col" className={Styles.tableHeadings}>Store Name</th>
                      <th scope="col" className={Styles.tableHeadings}>LOB</th>
                      <th scope="col" className={Styles.tableHeadings}>Text Image</th>
                      <th scope="col" className={Styles.tableHeadings}>Date Added</th>
                      <th scope="col" className={Styles.tableHeadings}>Date Modified</th>
                      <th scope="col" className={Styles.tableHeadings}>Show on Homepage</th>
                      <th scope="col" className={Styles.tableHeadings}>Show in Navigation</th>
                      <th scope="col" className={Styles.tableHeadings}>Soft Deleted</th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-2 py-2 text-center border-2"
                      >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item: any) => (
                      <tr className="border-b" key={item.sk}>
                        <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.storename}
                        </td>
                        <td className={Styles.tableData}>{item.lob}</td>
                        <td className={Styles.tableData}>{item.image}</td>
                        <td className={Styles.tableData}>{item.dateAdded}</td>
                        <td className={Styles.tableData}>{item.dateModified}</td>
                        <td className={Styles.tableData}>{item.showonhomepage}</td>
                        <td className={Styles.tableData}>{item.showinnavigation}</td>
                        <td className={Styles.tableData}>{item.deleted}</td>
                        <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap text-center">
                          <Link
                            href={{
                              pathname: "/stores/update",
                              query: {
                                pk: item.pk,
                                sk: item.sk,
                                storename: item.storename,
                                lob: item.lob,
                                image: item.image,
                                dateAdded: item.dateAdded,
                                dateModified: item.dateModified,
                                showonhomepage: item.showonhomepage,
                                showinnavigation: item.showinnavigation,
                                deleted: item.deleted
                              },
                            }}
                          >
                            <PencilSquareIcon color="green" className="w-6 h-6 inline-block" />
                          </Link>
                          <XCircleIcon className="w-6 h-6 inline-block" color="red" onClick={() => deleteItem(item.pk, item.sk)} />
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
