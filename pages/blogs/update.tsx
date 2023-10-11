import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const styles = {
  inputField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  disabledField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-100 bg-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  height: "form-group mb-6 h-96"
}

const UpdateData = () => {
  const router = useRouter();
  const data = router.query;

  const [longDescvalue, setLongDescvalue] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);

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
    getCategories()
     //@ts-ignore
    setLongDescvalue(data.longDesc);
  }, []);

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // setting up the parameters for UpdateCommand
    const params = {
      TableName: "Deals",
      Key: {
        pk: data.pk, //primaryKey
        sk: data.sk, //sortKey (if any)
      },
      UpdateExpression:
        "set title = :p, slug = :r, category = :o, longDesc = :q, blogstatus = :z, image = :l, listprice = :m, tag = :m, published_at = :n, dateModified = :k",
      ExpressionAttributeValues: {
        ":p": event.target.title.value,
        ":o": event.target.category.value,
        ":r": event.target.slug.value,
        ":q": longDescvalue,
        ":z": event.target.blogstatus.value,
        ":l": event.target.image.value,
        ":m": event.target.tag.value,
        ":n": (event.target.blogstatus.value === 'published' ? new Date().toLocaleString() : ""),
        ":k": new Date().toLocaleString()
      },
    };

    // updating the db
    try {
      const data = await ddbDocClient.send(new UpdateCommand(params));
      console.log("Success - updated", data);
      alert('Data Updated Successfully')
      router.push('/blogs/view')
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <>
      <div className="container mx-auto py-10 flex flex-col w-screen items-center">
        <div className="flex w-2/3 justify-end py-4">
          <Link
            href={{
              pathname: "/blogs/view",
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
            >View Blogs</button>
          </Link>
        </div>

        <p className="text-3xl mb-20">Update Blog</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
            <div className="form-group mb-6">
              <label htmlFor="slug" className="form-label inline-block mb-2 text-gray-700">Slug</label>
              <input type="text" className={styles.disabledField} id="slug" name="slug" defaultValue={data.slug} disabled={true} />
            </div>
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
              <label htmlFor="tag" className="form-label inline-block mb-2 text-gray-700">Tag</label>
              <input type="text" className={styles.inputField} id="tag" name="tag" defaultValue={data.tag} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="category" className="form-label inline-block mb-2 text-gray-700">Category</label>
              <select className={styles.inputField} id="category">
              <option value='' key='blank'></option>
                {categoriesData.map((category) => <option value={category.sk} key={category.sk} selected={category.sk === data.category}>{category.categoryname}</option>)}
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="blogstatus" className="form-label inline-block mb-2 text-gray-700">Status</label>
              <select className={styles.inputField} id="blogstatus" defaultValue={data.blogstatus}>
                <option value='draft' key={'draft'+data.slug}>Draft</option>
                <option value='published' key={'published'+data.slug}>Published</option>
                <option value='deleted' key={'deleted'+data.slug}>Deleted</option>
              </select>
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
