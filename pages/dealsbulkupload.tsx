import { useState } from "react";
import Papa from "papaparse";
import { ddbDocClient } from "../util/ddbDocClient";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

function DealsBulkUpload() {

  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [dealsList, setDealsList] = useState([]);

  const addBrands = async (brandname: any, lob?: any, image?: any) => {

    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "BRANDS",
        sk: "B#" + brandname.trim(), //uuidv4(),
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        brandname: brandname.trim(),
        lob,
        image,
        deleted: "n"
      },
    };

    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': 'BRANDS',
        ':meta': "B#" + brandname.trim()
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        return brandname + ' already exists';
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        return brandname + ' added successfully';
      }
    } catch (err: any) {
      console.log("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
    }
  };

  const addCategories = async (categoryname? : string, lob? : string, image? : string) => {
    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "CATEGORIES",
        sk: "C#" + categoryname.trim(), //uuidv4(),
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        categoryname: categoryname,
        lob,
        image,
        deleted: "n"
      },
    };

    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': 'CATEGORIES',
        ':meta': "B#" + categoryname.trim()
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        return categoryname + ' already exists';
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        return categoryname + ' added successfully';
      }
    } catch (err: any) {
      console.log("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
    }
  }

  const addStores = async (storename :string, lob? : string, image? : string) => {
    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "STORES",
        sk: "S#" + storename.trim(), //uuidv4(),
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        storename: storename.trim(),
        lob,
        image,
        deleted: "n"
      },
    };


    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': 'STORES',
        ':meta': "S#" + storename.trim()
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        return storename + ' already exists';
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        return storename + ' added successfully';
      }
    } catch (err: any) {
      console.log("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
    }
  };

  const addDeals = async (deal: {brandname :string, category:string, storename:string, image:string, textLink:string, description:string, listprice:string, dealprice:string, expiredon:string}) => {

    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "P#" + deal.textLink.trim(), //uuidv4(),
        sk: "METADATA",
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        brandname: "B#" + deal.brandname,
        category: "C#" + deal.category,
        storename: "S#" + deal.storename,
        image: deal.image,
        textLink: deal.textLink,
        description: deal.description,
        listprice: deal.listprice,
        dealprice: deal.dealprice,
        expiredon: deal.expiredon,
        deleted: "n"
      },
    };

    console.log(params)

    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': "P#" + deal.textLink.trim(),
        ':meta': "METADATA"
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        return deal.description + ' already exits'
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        return deal.description + ' added successfully'
      }
    } catch (err: any) {
      console.log("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
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

        const storesArr = [];
        const brandsArr = [];
        const categoriesArr = [];
        const dealsArr = [];

        valuesArray.forEach(async value => {
          const storename = value[0];
          const brandname = value[1];
          const category = value[2];
          const description = value[3];
          const textLink = value[4];
          const image = value[5];
          const listprice = value[6];
          const dealprice = value[7];
          const expiredon = value[8];
          
          if (!storesArr.includes(storename)) {
            storesArr.push(storename);
          }
          if (!brandsArr.includes(brandname)) {
            brandsArr.push(brandname)
          }
          if (!categoriesArr.includes(category)) {
            categoriesArr.push(category)
          }
          
          dealsArr.push({storename, brandname, category, description, textLink, image, listprice, dealprice, expiredon})
        
        });

        const storeAddStatus = []
        storesArr.forEach(async value => {
          const res = await addStores(value);
          storeAddStatus.push(res);
        });

        const brandAddStatus = []
        brandsArr.forEach(async value => {
          const res = await addBrands(value);
          brandAddStatus.push(res);
        });

        const categoryAddStatus = []
        categoriesArr.forEach(async value => {
          const res = await addCategories(value);
          categoryAddStatus.push(res);
        });

        const dealsAddStatus = []
        dealsArr.forEach(async value => {
          const res = await addDeals(value);
          dealsAddStatus.push(res);
        });

        setStoresList(storeAddStatus);
        setBrandsList(brandAddStatus);
        setCategoriesList(categoriesArr);
        setDealsList(dealsAddStatus);
        

        console.log('storesArr' + storesList);
        console.log('brandsArr' + brandsList);
        console.log('categoriesArr' + categoriesList);
        
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
      <br />
      {/* Table */}
      <table>
        <thead>
          <tr>
            <td>Stores</td>
          </tr>
        </thead>
        <tbody>
          {storesList.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <table>
        <thead>
          <tr>
            <td>Brands</td>
          </tr>
        </thead>
        <tbody>
          {brandsList.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <table>
        <thead>
          <tr>
            <td>Category</td>
          </tr>
        </thead>
        <tbody>
          {categoriesList.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <table>
        <thead>
          <tr>
            <td>Deals</td>
          </tr>
        </thead>
        <tbody>
          {dealsList.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DealsBulkUpload;