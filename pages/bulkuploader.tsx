import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ddbDocClient } from "../util/ddbDocClient";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

function DealsBulkUpload() {

  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [resultList, setResultList] = useState([]);

  const getStoresParams = {
    TableName: 'Deals',
    FilterExpression: 'pk = :prefix',
    ExpressionAttributeValues: {
      ':prefix': 'STORES'
    },
    ProjectionExpression:'sk'
  }

  const getBrandsParams = {
    TableName: 'Deals',
    FilterExpression: 'pk = :prefix',
    ExpressionAttributeValues: {
      ':prefix': 'BRANDS'
    },
    ProjectionExpression:'sk'
  }

  const getCategoriesParams = {
    TableName: 'Deals',
    FilterExpression: 'pk = :prefix',
    ExpressionAttributeValues: {
      ':prefix': 'CATEGORIES'
    },
    ProjectionExpression:'sk'
  }

  useEffect(() => {
    ddbDocClient.send(new ScanCommand(getStoresParams)).then((res) => {
      const sk = res.Items.map((item) => item.sk)
      setStoresList(sk);
    }).catch((err) => {
      console.log(err);
    })
  
    ddbDocClient.send(new ScanCommand(getBrandsParams)).then((res) => {
      const sk = res.Items.map((item) => item.sk)
      setBrandsList(sk);
    }).catch((err) => {
      console.log(err);
    })
  
    ddbDocClient.send(new ScanCommand(getCategoriesParams)).then((res) => {
      const sk = res.Items.map((item) => item.sk)
      setCategoriesList(sk);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  const addRecords = async (row: any[], value: any[]) => {

    const pkIndex = row.findIndex((element) => element === "pk");
    const skIndex = row.findIndex((element) => element === "sk");
    const storeIndex = row.findIndex((element) => element === "storename");
    const brandIndex = row.findIndex((element) => element === "brandname");
    const catIndex = row.findIndex((element) => element === "category");
    const dealItem = {};
    row.forEach((row, index) => {
      dealItem[row] = value[index];
      dealItem["dateModified"] = new Date().toLocaleString();
    });

    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: dealItem,
    };

    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': value[pkIndex],
        ':meta': value[skIndex]
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      console.log('storesList' + JSON.stringify(storesList));
      console.log('brandsList' + JSON.stringify(brandsList));
      console.log('categoriesList' + JSON.stringify(categoriesList));
      if(value[pkIndex].indexOf('P#') > -1) {
        if(value[skIndex] !== 'METADATA') {
          return value[pkIndex] + '| SK missing -> | ' + value[skIndex] + '|';
        } else if(!storesList.includes(value[storeIndex])) {
          return value[pkIndex] + '| Store incorrect or missing -> |' + value[storeIndex]+ '|';
        } else if(!brandsList.includes(value[brandIndex])) {
          return value[pkIndex] + '| Brand incorrect or missing -> | ' + value[brandIndex]+ '|';
        } else if(!categoriesList.includes(value[catIndex])) {
          return value[pkIndex] + '| Category incorrect or missing -> | ' + value[catIndex]+ '|';
        }
      } else if(value[pkIndex].indexOf('BLOG#') > -1) {
        if(value[skIndex] !== 'METADATA') {
          return value[pkIndex] + '| SK missing -> | ' + value[skIndex]+ '|';
        } else if(!categoriesList.includes(value[catIndex])) {
          return value[pkIndex] + '| Category incorrect or missing -> | ' + value[catIndex]+ '|';
        }
      } else if(value[pkIndex] === 'BRANDS') {
        console.log("value[skIndex]" + value[skIndex])
        if(value[skIndex].indexOf('B#') < 0) {
          return value[pkIndex] + '| SK missing -> |' + value[skIndex]+ '|';
        }
      } else if(value[pkIndex] === 'STORES#') {
        console.log("value[skIndex]" + value[skIndex])
        if(value[skIndex].indexOf('S#') < 0) {
          return value[pkIndex] + '| SK missing -> |' + value[skIndex]+ '|';
        }
      } else if(value[pkIndex] === 'CATEGORIES') {
        console.log("value[skIndex]" + value[skIndex])
        if(value[skIndex].indexOf('C#') < 0) {
          return value[pkIndex] + '| SK missing -> |' + value[skIndex]+ '|';
        }
      }
     
      if (getData?.Items?.length > 0) {
        const data = await ddbDocClient.send(new PutCommand(params));
        return value[pkIndex] + '|' + value[skIndex] + '| Already exits. Overwritten | httpscode: ' + data.$metadata.httpStatusCode;
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        return value[pkIndex] + '|' + value[skIndex] + '| Added successfully |  httpscode: ' + data.$metadata.httpStatusCode;
      }
    } catch (err: any) {
      console.log("Error", err.stack);
      //alert("Error occured" + JSON.stringify(err));
    }
  };

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        const row: [] = rowsArray[0];
       
        valuesArray.forEach(async value => {
          const res = await addRecords(row, value);
          const temp = resultList;
          temp.push(res);
          setResultList([...temp]);
        });
      },
    });
  };

  return (
    <div>
      {/* File Uploader */}
      
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <br />
      <div className="status-table">
        <table>
          <thead>
            <tr>
              <td>Index</td><td>pk</td><td>sk</td><td>Status</td><td>Output</td>
            </tr>
          </thead>
          <tbody>
            {resultList.map((value, index) => {
              const arr = value.split('|');
              return (
                <tr key={index}>
                  <td>{index}</td> <td>{arr[0]}</td><td>{arr[1]}</td><td>{arr[2]}</td><td>{arr[3]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DealsBulkUpload;