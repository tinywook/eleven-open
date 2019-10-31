/*
* Filename: getPageData.js
* Lambda name: EE_page_data
* Project:  EEOpen_pageBuilder
* Maintainer: Jon Stephenson jstephenson@commercialnoise.com
* Node ver: 10.x
*
* This returns the page data for the requested page
*/

let AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
let lambda = new AWS.Lambda();
let dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {



};
