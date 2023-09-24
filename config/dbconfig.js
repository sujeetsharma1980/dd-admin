// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Set the AWS Region.
const REGION = "us-west-2"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
console.log('process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID - ' + process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID);
console.log('process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY - ' + process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY);
const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export { ddbClient };
