import { ddbDocClient } from "../../config/ddbDocClient";
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
        "set dealsource = :p, category = :r, image = :q, textLink = :z, description = :l, listprice = :m, dealprice = :n, dateModified = :k, deleted = :o",
      ExpressionAttributeValues: {
        ":p": event.target.dealsource.value,
        ":r": event.target.category.value,
        ":q": event.target.image.value,
        ":z": event.target.textLink.value,
        ":l": event.target.description.value,
        ":m": event.target.listprice.value,
        ":n": event.target.dealprice.value,
        ":o": event.target.deleted.value,
        ":k": new Date().toLocaleString()
      },
    };

    // updating the db
    try {
      const data = await ddbDocClient.send(new UpdateCommand(params));
      console.log("Success - updated", data);
      alert('Data Updated Successfully')
      router.push('/deals/view')
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
              pathname: "/",
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
            >Update Deals</button>
          </Link>
        </div>

          <p className="text-3xl mb-20">Update Deals</p>
          <div className="block p-6 rounded-lg shadow-lg bg-white w-2/3 justify-self-center">
            <form onSubmit={handleSubmit} id="addData-form">
              <div className="form-group mb-6">
                <label htmlFor="dealsource" className="form-label inline-block mb-2 text-gray-700">Source</label>
                <input type="text" className={styles.inputField} id="dealsource" name="dealsource" defaultValue={data.dealsource} />
              </div>
              <div className="form-group mb-6">
                <label htmlFor="category" className="form-label inline-block mb-2 text-gray-700">Category</label>
                <input type="text" className={styles.inputField} id="category" name="category" defaultValue={data.category} />
              </div>
              <div className="form-group mb-6">
                <label htmlFor="image" className="form-label inline-block mb-2 text-gray-700">Image</label>
                <input type="text" className={styles.inputField} id="image" name="image" defaultValue={data.image} />
              </div>
              <div className="form-group mb-6">
                <label htmlFor="textLink" className="form-label inline-block mb-2 text-gray-700">Link</label>
                <input type="text" className={styles.inputField} id="textLink" name="textLink" defaultValue={data.textLink} />
              </div>
              <div className="form-group mb-6">
                <label htmlFor="description" className="form-label inline-block mb-2 text-gray-700">Description</label>
                <input type="text" className={styles.inputField} id="description" name="description" defaultValue={data.description} />
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
                <label htmlFor="deleted" className="form-label inline-block mb-2 text-gray-700">Deleted</label>
                <input type="text" className={styles.inputField} id="deleted" name="deleted" defaultValue={data.deleted} />
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
