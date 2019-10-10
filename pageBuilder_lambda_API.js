/*
 * Filename: pageBuilder_lambda_API.js
 * Lambda name: EEOpen_pageBuilder_API
 * Project: EE Open
 * version: 0.0.1
 * Maintainer: Jon Stephenson jstephenson@elevenengine.com
 * Node ver: 10.x
 *
 * Returns JSON data
 */


let AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
let lambda = new AWS.Lambda();
let dynamodb = new AWS.DynamoDB.DocumentClient();

let importTable = `timImport`;
let finalTable = `ERP_data`;
let ver = `0.1`;

module.exports.handler = async(event) => {

	function returnBody(requestEvent) {
		
    host = requestEvent.headers.Host;

		body = `{"lambdaCalled": "EE_pageBuilder_OPEN_API" "host": "${host}", "ver": "${ver}", "body": ${requestEvent.body}, "requestEvent": ${JSON.stringify(requestEvent)}}`;
    
		responseBody = {
		    "isBase64Encoded": false,
		    "statusCode": 200,
		    "headers": {
				'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
			},
		    "body": body
		}
		return responseBody
	};

  return returnBody(event);

};
