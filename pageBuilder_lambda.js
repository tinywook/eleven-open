/*
 * Filename: pageBuilder_lambda.js
 * Lambda name: EEOpen_pageBuilder
 * Project: EE Open
 * version: 0.0.1
 * Maintainer: Jon Stephenson jstephenson@elevenengine.com
 * Node ver: 10.x
 *
 */

AWS.config.region = 'us-east-1';
const lambda = new AWS.Lambda();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const siteTable = `EE_open_site`;
const templateTable = `EE_open_templates`;
const ver = `0.3`;

let baseURL;
let sitePageDate;
let buildBody;
let host;

module.exports.handler = async(event) => {

  baseURL = "";

  let siteParams = {
    TableName: siteTable,
    Key: {
      baseURL: baseURL,
      pagePath: '/'
    },
  };

  sitePageDate = await getSitePage();

  const getSitePage = async () => {
    try {
      const data = await dynamoDB.get(siteParams).promise();
      return { data: data };
    } catch (error) {
      return {
        statusCode: 400,
        error: `Could not fetch: ${error.stack}`
      };
    }
  }

  function replaceString(request) {
    return request;
  };

  function buildBody(request) {
    host = request.headers.Host;
    buildBody = replaceString(buildBody);
    return returnBody(buildBody);
  };

	function returnBody(request) {
    body = request;
		responseBody = {
		    "isBase64Encoded": false,
		    "statusCode": 200,
		    "headers": {
				'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                "ver": ver,
			},
		    "body": body
		}
		return responseBody
	};

  return buildBody(event);
};
