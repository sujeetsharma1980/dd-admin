const awsBuildId = process.env.NEXT_PUBLIC_AWS_BUILD_ID
const awsBuildToken = process.env.NEXT_PUBLIC_AWS_BUILD_TOKEN
//   scanning the dynamodb table
export default async (req, res) => {

    try {
        const webHookUrl = `https://webhooks.amplify.us-west-2.amazonaws.com/prod/webhooks?id=${awsBuildId}&token=${awsBuildToken}&operation=startbuild`;

        const requestMetadata = {
            method: 'POST',
            headers: {
                'Host': 'webhooks.amplify.us-west-2.amazonaws.com',
                'User-Agent': 'curl/8.1.1',
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            }
        };

        fetch(webHookUrl, requestMetadata)
            .then(res => res.json())
            .then(ress => {
                res.status(200).send("Build started successfully..");
            });
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error starting build..");
    }
};