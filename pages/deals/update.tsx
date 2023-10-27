import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
}

const UpdateData = () => {
  const router = useRouter();
  const data = router.query;
  const [longDescvalue, setLongDescvalue] = useState("");
  const [brandsData, setBrandsData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoriesData, setSubcategoriesData] = useState([]);

  useEffect(() => {
    getStores();
    getBrands();
    getCategories();
    setLongDescvalue(data.description as string);
  }, []);

  useEffect(() => {
    const category = categoriesData.filter(category => category.sk === data.category)
    setSubcategoriesData(category[0]?.subcategories)
  }, [categoriesData, data.category]);

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
      //console.log("sdata", sdata.Items);
    } catch (err) {
      console.error("Error", err);
    }
  };
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
      //console.log("bdata", bdata.Items);
    } catch (err) {
      console.error("Error", err);
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
      //console.log("cdata", cdata.Items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    alert(event.target.subcategory.value);
    // setting up the parameters for UpdateCommand
    const params = {
      TableName: "Deals",
      Key: {
        pk: data.pk, //primaryKey
        sk: data.sk, //sortKey (if any)
      },
      UpdateExpression:
        "set brandname = :p, category = :r, popular = :h, exclusiveone = :i, subcategory = :d, featured = :j, storename = :s, image = :q, title = :t, tag = :u, submittedby = :x, textLink = :z, description = :l, listprice = :m, dealprice = :n, dateModified = :k, deleted = :o, expiredon = :y",
      ExpressionAttributeValues: {
        ":p": event.target.brandname.value,
        ":r": event.target.category.value,
        ":s": event.target.storename.value,
        ":q": event.target.image.value,
        ":z": event.target.textLink.value,
        ":t": event.target.title.value,
        ":l": longDescvalue,
        ":u": event.target.tag.value,
        ":m": event.target.listprice.value,
        ":n": event.target.dealprice.value,
        ":x": event.target.submittedby.value,
        ":o": event.target.deleted.value,
        ":h": event.target.popular.checked,
        ":i": event.target.exclusiveone.checked,
        ":j": event.target.featured.checked,
        ":d": event.target.subcategory.value,
        ":y": event.target.expiredon.value,
        ":k": new Date().toLocaleString()
      },
    };

    // updating the db
    try {
      const data = await ddbDocClient.send(new UpdateCommand(params));
      //console.log("Success - updated", data);
      alert('Data Updated Successfully')
      router.push('/deals/view')
    } catch (err) {
      console.error("Error", err);
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

        <p className="text-3xl mb-20">Update Deals</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
          <div className="form-group mb-6">
              <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">Title</label>
              <input type="text" className={styles.inputField} id="title" name="title" defaultValue={data.title} />
            </div>
            <div className={styles.height}>
              <label htmlFor="description" className="form-label inline-block mb-2 text-gray-700">Description</label>
              <MDEditor value={longDescvalue} onChange={setLongDescvalue} id="longDesc" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
              <input type="text" className={styles.inputField} id="image" name="image" defaultValue={data.image} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="textLink" className="form-label inline-block mb-2 text-gray-700">Deal Link</label>
              <input type="text" className={styles.inputField} id="textLink" name="textLink" defaultValue={data.textLink} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="listprice" className="form-label inline-block mb-2 text-gray-700">List Price</label>
              <input type="text" className={styles.inputField} id="listprice" name="listprice" defaultValue={data.listprice} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="dealprice" className="form-label inline-block mb-2 text-gray-700">Deal Price</label>
              <input type="text" className={styles.inputField} id="dealprice" name="dealprice" defaultValue={data.dealprice} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="tag" className="form-label inline-block mb-2 text-gray-700">SEO Tags</label>
              <input type="text" className={styles.inputField} id="tag" name="tag" defaultValue={data.tag} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="brandname" className="form-label inline-block mb-2 text-gray-700">Brand</label>
              <select className={styles.inputField} id="brandname" required>
              <option value='' key='blank'></option>
                {brandsData.map((brand) => <option value={brand.sk} key={brand.sk} selected={brand.sk === data.brandname}>{brand.brandname}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="storename" className="form-label inline-block mb-2 text-gray-700">Store</label>
              <select className={styles.inputField} id="storename" required>
                <option value='' key='blank'></option>
                {storesData.map((store) => <option value={store.sk} key={store.sk} selected={store.sk === data.storename}>{store.storename}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="category" className="form-label inline-block mb-2 text-gray-700">Category</label>
              <select className={styles.inputField} id="category"  onChange={(e) => setSelectedCategory(e.target.value)} required>
              <option value='' key='blank'></option>
                {categoriesData.map((category) => <option value={category.sk} key={category.sk} selected={category.sk === data.category}>{category.categoryname}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="subcategory" className="form-label inline-block mb-2 text-gray-700">Sub Category</label>
              <select className={styles.inputField} id="subcategory" required>
                {subcategoriesData?.map((subcategory) => <option value={subcategory} key={subcategory} selected={subcategory === data.subcategory}>{subcategory}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="popular" className="form-label inline-block mb-2 text-gray-700">Popular </label>
              <input type="checkbox" className={styles.checkbox} id="popular" name="popular" defaultChecked={data.popular === 'true'} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="featured" className="form-label inline-block mb-2 text-gray-700">Featured </label>
              <input type="checkbox" className={styles.checkbox} id="featured" name="featured" defaultChecked={data.featured === 'true'} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="exclusiveone" className="form-label inline-block mb-2 text-gray-700">Exclusive </label>
              <input type="checkbox" className={styles.checkbox} id="exclusiveone" name="exclusiveone" defaultChecked={data.exclusiveone === 'true'}/>
            </div>

            <div className="form-group mb-6">
              <label htmlFor="deleted" className="form-label inline-block mb-2 text-gray-700">Deleted</label>
              <select className={styles.inputField} id="deleted" defaultValue={data.deleted}>
                <option value='y' key='y'>y</option>
                <option value='n' key='n'>n</option>
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="submittedby" className="form-label inline-block mb-2 text-gray-700">Submitted By</label>
              <input type="text" className={styles.inputField} id="submittedby" name="submittedby" defaultValue={data.submittedby} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="expiredon" className="form-label inline-block mb-2 text-gray-700">Expired On</label>
              <input type="date" className={styles.inputField} id="expiredon" defaultValue={data.expiredon}/>
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

export default UpdateData;
