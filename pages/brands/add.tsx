import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import Link from "next/link";

const styles = {
  inputField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
};

const AddData = () => {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const params = {
      TableName: "Deals",
      Item: {
        pk: "BRANDS",
        sk: "B#" + event.target.brandname.value.trim(), //uuidv4(),
        dateAdded: new Date().toLocaleString(),
        dateModified: "",
        brandname: event.target.brandname.value,
        lob: event.target.lob.value,
        image: event.target.image.value,
        deleted: "n",
        showonhomepage: event.target.showonhomepage.value,
        showinnavigation: event.target.showinnavigation.value
      },
    };


    const getParams = {
      TableName: 'Deals',
      FilterExpression: '(pk = :prefix and sk = :meta)',
      ExpressionAttributeValues: {
        ':prefix': 'BRANDS',
        ':meta': "B#" + event.target.brandname.value.trim()
      }
    }

    try {
      const getData = await ddbDocClient.send(new ScanCommand(getParams));
      if (getData?.Items?.length > 0) {
        alert("Brand already exists");
      } else {
        const data = await ddbDocClient.send(new PutCommand(params));
        //console.log("Success - item added", data);
        alert("Data Added Successfully");
        router.push("/brands/view");
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
              pathname: "/brands/view",
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
            >View Brands</button>
          </Link>
        </div>

        <p className="text-3xl mb-20">Add Brands</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
            <div className="form-group mb-6">
              <label htmlFor="brandname" className="form-label inline-block mb-2 text-gray-700">Brand Name</label>
              <input type="text" className={styles.inputField} id="brandname" />
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
          </form >

        </div >
      </div >
    </>
  );
};

export default AddData;
