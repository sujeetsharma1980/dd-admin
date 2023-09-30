import axios from 'axios'

const Deploy = () => {

    const invokeWebHook = async e => {
        e.preventDefault();
        try {
            const url = '/api/invokeAwsBuild';
            const response = await axios.post(url, {});
            alert(response);
        } catch (error) {
            alert(error);
            console.log(error)
        }
    };

    return (
        <>
            <div className="container mx-auto py-10 flex flex-col w-screen h-screen items-center">
                <div className="flex flex-col py-10">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-white">
                                <button
                                    onClick={invokeWebHook}
                                    type="button"
                                    className="inline-block px-6 py-2.5 mr-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                >Deploy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Deploy;
