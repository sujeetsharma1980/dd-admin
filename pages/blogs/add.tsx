import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const styles = {
  inputField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  height: "form-group mb-6 h-96"
};

const AddData = () => {
  const router = useRouter();

  const [longDescvalue, setLongDescvalue] = useState("");

  useEffect(() => {
  }, []);

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const putParams = {
      TableName: "Deals",
      Item: {
        pk: "BLOG#" + event.target.slug.value, //uuidv4(),
        sk: "METADATA",
        dateAdded: new Date().toLocaleString(),
        published_at: (event.target.blogstatus.value === 'published' ? new Date().toLocaleString() : ""),
        dateModified: "",
        title: event.target.title.value,
        slug: event.target.slug.value,
        longDesc: longDescvalue,
        image: event.target.image.value,
        tag: event.target.tag.value,
        blogstatus: event.target.blogstatus.value
      },
    };

    const getParams = {
      TableName: 'Deals',
      Key: {
        pk: "BLOG#" + event.target.slug.value,
        sk: "METADATA",
      }
    }
   
    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if(getData?.Items?.length > 0) {
        alert("Blog Already exists");
      } else {
        const data = await ddbDocClient.send(new PutCommand(putParams));
        console.log("Success - item added", data);
        alert("Data Added Successfully");
        router.push("/blogs/view");
        //@ts-ignore
        document.getElementById("addData-form").reset();
      }
      
    } catch (err: any) {
      console.log("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
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

        <p className="text-3xl mb-20">Add Blog</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
            <div className="form-group mb-6">
              <label htmlFor="slug" className="form-label inline-block mb-2 text-gray-700">Slug</label>
              <input type="text" className={styles.inputField} id="slug" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="title" className="form-label inline-block mb-2 text-gray-700">Title</label>
              <input type="text" className={styles.inputField} id="title" />
            </div>
            <div className={styles.height}>
              <label htmlFor="longDesc" className="form-label inline-block mb-2 text-gray-700">Description</label>
              <MDEditor value={longDescvalue} onChange={setLongDescvalue} id="longDesc" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
              <input type="text" className={styles.inputField} id="image" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="tag" className="form-label inline-block mb-2 text-gray-700">Tag</label>
              <input type="text" className={styles.inputField} id="tag" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="blogstatus" className="form-label inline-block mb-2 text-gray-700">Status</label>
              <select className={styles.inputField} id="blogstatus">
                <option value='draft' key='draft'>Draft</option>
                <option value='published' key='published'>Published</option>
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

export default AddData;
