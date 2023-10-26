import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";


const styles = {
  inputField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  subCatInputField: "form-control w-3/4 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
  button: "px-6 py-2.5 m-1 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
};

const AddData = () => {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState(['']); // Initialize with one empty input

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "CATEGORIES",
        sk: "C#" + event.target.categoryname.value.trim(), //uuidv4(),
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        categoryname: event.target.categoryname.value,
        lob: event.target.lob.value,
        image: event.target.image.value,
        deleted: "n",
        showonhomepage: event.target.showonhomepage.value,
        showinnavigation: event.target.showinnavigation.value,
        subcategories: subcategories
      },
    };

    //console.log(params)

    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': 'CATEGORIES',
        ':meta': "B#" + event.target.categoryname.value.trim()
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        alert("Category already exists");
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        //console.log("Success - item added", data);
        alert("Data Added Successfully");
        router.push("/categories/view");
        //@ts-ignore
        document.getElementById("addData-form").reset();
      }
    } catch (err: any) {
      console.error("Error", err.stack);
      alert("Error occured" + JSON.stringify(err));
    }
  };



  const addSubcategory = () => {
    setSubcategories([...subcategories, '']); // Add a new empty input
  };

  const removeSubcategory = (index) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories.splice(index, 1); // Remove the input at the specified index
    setSubcategories(updatedSubcategories);
  };

  const moveUp = (index) => {
    if (index > 0) {
      const updatedSubcategories = [...subcategories];
      const temp = updatedSubcategories[index];
      updatedSubcategories[index] = updatedSubcategories[index - 1];
      updatedSubcategories[index - 1] = temp;
      setSubcategories(updatedSubcategories);
    }
  };

  const moveDown = (index) => {
    if (index < subcategories.length - 1) {
      const updatedSubcategories = [...subcategories];
      const temp = updatedSubcategories[index];
      updatedSubcategories[index] = updatedSubcategories[index + 1];
      updatedSubcategories[index + 1] = temp;
      setSubcategories(updatedSubcategories);
    }
  };

  const handleSubcategoryChange = (value, index) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index] = value; // Update the input at the specified index
    setSubcategories(updatedSubcategories);
  };

  const handleCatSubmit = (e) => {
    e.preventDefault();
    // Do something with the subcategories, e.g., send them to an API or save to state.
    console.log('Subcategories:', subcategories);
  };

  return (
    <>
      <div className="container mx-auto py-10 flex flex-col w-screen items-center">
        <div className="flex w-2/3 justify-end py-4">
          <Link
            href={{
              pathname: "/categories/view",
            }}
          >
            <button
              type="button"
              className={styles.button}
            >View Categories</button>
          </Link>
        </div>

        <p className="text-3xl mb-20">Add Categories</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
            <div className="form-group mb-6">
              <label htmlFor="categoryname" className="form-label inline-block mb-2 text-gray-700">Category Name</label>
              <input type="text" className={styles.inputField} id="categoryname" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="subcategories" className="form-label inline-block mb-2 text-gray-700">Sub Categories</label>
              {subcategories.map((subcategory, index) => (
                <div key={index}>
                  <input type="text" id="subcategories" value={subcategory} className={styles.subCatInputField} onChange={(e) => handleSubcategoryChange(e.target.value, index)} />
                  <button type="button" className={styles.button} onClick={() => removeSubcategory(index)}> -</button>
                  <button type="button" className={styles.button} onClick={() => moveUp(index)} disabled={index === 0}>A</button>
                  <button type="button" onClick={() => moveDown(index)} disabled={index === subcategories.length - 1} className={styles.button} >v</button>
                </div>
              ))}
              <button type="button" onClick={addSubcategory} className={styles.button}>+</button>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="lob" className="form-label inline-block mb-2 text-gray-700">LOB</label>
              <input type="text" className={styles.inputField} id="lob" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
              <input type="text" className={styles.inputField} id="image" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="showonhomepage" className="form-label inline-block mb-2 text-gray-700">Show on homepage</label>
              <select className={styles.inputField} id="showonhomepage" required>
                <option value="n" key="n">N</option>
                <option value="y" key="y">Y</option>
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="showinnavigation" className="form-label inline-block mb-2 text-gray-700">Show in navigation</label>
              <select className={styles.inputField} id="showinnavigation" required>
                <option value="n" key="n">N</option>
                <option value="y" key="y">Y</option>
              </select>
            </div>
            
            <button type="submit" className={styles.button}>Submit</button>
          </form>

        </div>
      </div>
    </>
  );
};

export default AddData;
