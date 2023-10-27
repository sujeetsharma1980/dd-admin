import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import Link from "next/link";

import { useEffect, useState } from "react";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const styles = {
  inputField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  checkbox: "form-control px-3 py-1.5 ml-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  height: "form-group mb-6 h-96"
};

const AddData = () => {
  const router = useRouter();
  const [longDescvalue, setLongDescvalue] = useState("");
  const [brandsData, setBrandsData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoriesData, setSubcategoriesData] = useState([]);

  useEffect(() => {
    getBrands();
    getStores();
    getCategories();
  }, []);

  useEffect(() => {
    const category = categoriesData.filter(category => category.sk === selectedCategory)
    setSubcategoriesData(category[0]?.subcategories)
  }, [selectedCategory]);


  //   scanning the dynamodb table for Stores
  const getStores = async () => {
    try {
      const params = {
        TableName: 'Deals',
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'STORES'
        }
      }
      const sdata = await ddbDocClient.send(new ScanCommand(params));
      setStoresData(sdata.Items);
      //console.log("bdata", sdata.Items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  //   scanning the dynamodb table for Brands
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
      //console.log("bdata", bdata.Items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  //   scanning the dynamodb table for Categories
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
      //console.log("cdata", cdata.Items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "P#" + event.target.textLink.value.trim(), //uuidv4(),
        sk: "METADATA",
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        title: event.target.title.value,
        description: longDescvalue,
        image: event.target.image.value,
        textLink: event.target.textLink.value,
        listprice: event.target.listprice.value,
        dealprice: event.target.dealprice.value,
        brandname: event.target.brandname.value,
        category: event.target.category.value,
        subcategory: event.target.subCategory.value,
        tag: event.target.tag.value,
        storename: event.target.storename.value,
        submittedby: event.target.submittedby.value,
        expiredon: event.target.expiredon.value,
        popular: event.target.popular.checked,
        exclusiveone: event.target.exclusiveone.checked,
        featured: event.target.featured.checked,
        deleted: "n"
      },
    };

    console.log(params)

    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': "P#" + event.target.textLink.value.trim(),
        ':meta': "METADATA"
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        alert("Deal already exists");
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        //console.log("Success - item added", data);
        alert("Data Added Successfully");
        router.push("/deals/view");
        //@ts-ignore
        document.getElementById("addData-form").reset();
      }
    } catch (err: any) {
      console.error("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
    }
  };
  return (
    <>
      <div className="container mx-auto py-10 flex flex-col w-screen items-center">
        <div className="flex w-2/3 justify-end py-4">
          <Link
            href={{
              pathname: "/deals/view",
            }}
          >
            <button
              type="button"
              className="
              inline-block px-6 py-2.5 mr-2 
              bg-blue-600 text-white font-medium 
              text-xs leading-tight uppercase 
              rounded shadow-md hover:bg-blue-700 
              hover:shadow-lg focus:bg-blue-700 
              focus:shadow-lg focus:outline-none 
              focus:ring-0 active:bg-blue-800 
              active:shadow-lg transition 
              duration-150 ease-in-out"
            >View Deals</button>
          </Link>
        </div>

        <p className="text-3xl mb-20">Add Deals</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
            <div className="form-group mb-6">
                <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">Title</label>
                <input type="text" className={styles.inputField} id="title" />
            </div>
            <div className={styles.height}>
              <label htmlFor="description" className="form-label inline-block mb-2 text-gray-700">Description</label>
              <MDEditor value={longDescvalue} onChange={setLongDescvalue} id="longDesc" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
              <input type="text" className={styles.inputField} id="image" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="textLink" className="form-label inline-block mb-2 text-gray-700">Deal Link</label>
              <input type="text" className={styles.inputField} id="textLink" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="listprice" className="form-label inline-block mb-2 text-gray-700">List Price</label>
              <input type="text" className={styles.inputField} id="listprice" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="dealprice" className="form-label inline-block mb-2 text-gray-700">Deal Price</label>
              <input type="text" className={styles.inputField} id="dealprice" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="tag" className="form-label inline-block mb-2 text-gray-700">SEO Tags</label>
              <input type="text" className={styles.inputField} id="tag" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="brandname" className="form-label inline-block mb-2 text-gray-700">Brand</label>
              <select className={styles.inputField} id="brandname" required>
                {brandsData.map((brand) => <option value={brand.sk} key={brand.sk}>{brand.brandname}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="storename" className="form-label inline-block mb-2 text-gray-700">Store</label>
              <select className={styles.inputField} id="storename" required>
                {storesData.map((store) => <option value={store.sk} key={store.sk}>{store.storename}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="category" className="form-label inline-block mb-2 text-gray-700">Category</label>
              <select className={styles.inputField} id="category" onChange={(e) => setSelectedCategory(e.target.value)} required>
                <option value="" key=""></option>
                {categoriesData.map((category) => <option value={category.sk} key={category.sk}>{category.categoryname}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="subcategory" className="form-label inline-block mb-2 text-gray-700">Sub Category</label>
              <select className={styles.inputField} id="subcategory" required>
                {subcategoriesData?.map((subcategory) => <option value={subcategory} key={subcategory}>{subcategory}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="popular" className="form-label inline-block mb-2 text-gray-700">Popular </label>
              <input type="checkbox" className={styles.checkbox} id="popular" name="popular"  />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="featured" className="form-label inline-block mb-2 text-gray-700">Featured </label>
              <input type="checkbox" className={styles.checkbox} id="featured" name="featured" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="exclusiveone" className="form-label inline-block mb-2 text-gray-700">Exclusive </label>
              <input type="checkbox" className={styles.checkbox} id="exclusiveone" name="exclusiveone" />
            </div>
            <div className="form-group mb-6">
                <label htmlFor="submittedby" className="form-label inline-block mb-2 text-gray-700">Submitted By</label>
                <input type="text" className={styles.inputField} id="submittedby" defaultValue="Deal Detector Team"/>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="expiredon" className="form-label inline-block mb-2 text-gray-700">Expired On</label>
              <input type="date" className={styles.inputField} id="expiredon" />
            </div>

            <button type="submit" className="
              px-6
              py-2.5
              bg-blue-600
              text-white
              font-medium
              text-xs
              leading-tight
              uppercase
              rounded
              shadow-md
              hover:bg-blue-700 hover:shadow-lg
              focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
              active:bg-blue-800 active:shadow-lg
              transition
              duration-150
              ease-in-out">Submit</button>
          </form>

        </div>
      </div>
    </>
  );
};

export default AddData;
