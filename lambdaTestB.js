/*
 * Filename: lambdaTestB.js
 * Lambda name: lambdaTestB
 * Project:  EEOpen_pageBuilder
 * Maintainer: Jon Stephenson jstephenson@commercialnoise.com
 * Node ver: 10.x
 *
 * Test this bitch
 */

let AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
let lambda = new AWS.Lambda();
let dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async(event) => {


}
