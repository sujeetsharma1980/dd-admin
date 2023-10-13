import { ddbDocClient } from "../../util/ddbDocClient";
import { useRouter } from "next/router";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Link from "next/link";
import { useEffect } from "react";

const styles = {
  inputField: "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
}


const UpdateData = () => {
  const router = useRouter();
  const data = router.query;

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
        "set categoryname = :p, lob = :r, image = :q, dateModified = :k, deleted = :o, showinnavigation = :t,showonhomepage = :s ",
      ExpressionAttributeValues: {
        ":p": event.target.categoryname.value,
        ":r": event.target.lob.value,
        ":q": event.target.image.value,
        ":s": event.target.showonhomepage.value,
        ":t": event.target.showinnavigation.value,
        ":o": event.target.deleted.value,
        ":k": new Date().toLocaleString()
      },
    };

    // updating the db
    try {
      const data = await ddbDocClient.send(new UpdateCommand(params));
      //console.log("Success - updated", data);
      alert('Data Updated Successfully')
      router.push('/categories/view')
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
              pathname: "/categories/view",
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
            >View categories</button>
          </Link>
        </div>

        <p className="text-3xl mb-20">Update Categories</p>
        <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
          <form onSubmit={handleSubmit} id="addData-form">
            <div className="form-group mb-6">
              <label htmlFor="categoryname" className="form-label inline-block mb-2 text-gray-700">Category Name</label>
              <input type="text" className={styles.inputField} id="categoryname" name="categoryname" defaultValue={data.categoryname} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="lob" className="form-label inline-block mb-2 text-gray-700">LOB</label>
              <input type="text" className={styles.inputField} id="lob" name="lob" defaultValue={data.lob} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
              <input type="text" className={styles.inputField} id="image" name="image" defaultValue={data.image} />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="deleted" className="form-label inline-block mb-2 text-gray-700">Deleted</label>
              <select className={styles.inputField} id="deleted" defaultValue={data.deleted}>
                <option value='y' key='y'>y</option>
                <option value='n' key='n'>n</option>
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="showonhomepage" className="form-label inline-block mb-2 text-gray-700">Show on homepage</label>
              <select className={styles.inputField} id="showonhomepage" defaultValue={data.showonhomepage}>
                <option value="n" key="n">N</option>
                <option value="y" key="y">Y</option>
              </select>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="showinnavigation" className="form-label inline-block mb-2 text-gray-700">Show in navigation</label>
              <select className={styles.inputField} id="showinnavigation" defaultValue={data.showinnavigation}>
                <option value="y" key="y">Y</option>
                <option value="n" key="n">N</option>
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
