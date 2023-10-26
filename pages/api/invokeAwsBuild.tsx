import { NextApiRequest, NextApiResponse } from "next";

const awsBuildIdMain = process.env.BUILD_ID
const awsBuildTokenMain = process.env.BUILD_TOKEN
const awsBuildIdPreview = process.env.FEATURE_BUILD_ID
const awsBuildTokenPreview = process.env.FEATURE_BUILD_TOKEN
//   scanning the dynamodb table
export default async (req: NextApiRequest, res: NextApiResponse) => {

    const { query: { env } } = req;

    try {
        let awsBuildId = awsBuildIdMain
        let awsBuildToken = awsBuildTokenMain
        if (env === 'preview') {
            awsBuildId = awsBuildIdPreview
            awsBuildToken = awsBuildTokenPreview
        }
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
                res.status(200).send("Build started successfully.. webhook -" + webHookUrl +" "+ JSON.stringify(ress));
            });

    } catch (error) {
        console.log(error);
        res.status(500).send("Error starting build.." + JSON.stringify(error));
    }
};