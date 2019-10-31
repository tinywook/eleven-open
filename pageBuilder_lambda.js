/*
 * Filename: pageBuilder_lambda.js
 * Lambda name: EEOpen_pageBuilder
 * Project: EE Open
 * version: 0.0.2
 * Maintainer: Jon Stephenson jstephenson@commercialnoise.com
 * Node ver: 10.x
 *
 * Lambda to build EEOpen pages
 */

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const lambda = new AWS.Lambda();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const siteTable = `EEOpen_sites`;
const ver = `0.0.2`;

let siteURL;
let pagePath;
let host;
let TableName;
let pageData;

module.exports.handler = async(event) => {

  siteURL = 'codedthis.com';
  pagePath = event.path;

  let pageParams = {
    TableName: siteTable,
    Key: {
      siteURL: siteURL,
      pagePath: pagePath
    }
  };

	async function returnBody(requestEvent) {

    host = requestEvent.headers.Host;
    path = requestEvent.path;
    pageData = await getPageData()


    //body = parseTemplate(pageData);
    body = `{"data": "data"}`;
		responseBody = {
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": {
      "Content-Type": "text/html",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
              "ver": ver,
			},
		    "body": body
		}
		return responseBody
	};

  async function getPageData() {
    let queryParams = await dynamoDB.get(pageParams).promise().then();
    console.log(`queryParams ${JSON.stringify(queryParams)}`);


    return {queryParams}; 
  }

  return returnBody(event);
};
