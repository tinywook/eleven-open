/*
 * Filename: pushPageData.js
 * Lambda name: EE_page_data
 * Project:  EEOpen_pageBuilder
 * Maintainer: Jon Stephenson jstephenson@commercialnoise.com
 * Node ver: 10.x
 *
 * This function publishes content data
 */

let AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
let lambda = new AWS.Lambda();
let dynamodb = new AWS.DynamoDB.DocumentClient();

let holderNavigationTable = 'holderNav';
let holderContentTable = 'holderContent';
let holderSiteTable = 'holderSite';
let contentTable = 'content-dev';
let getPageDataLambda = 'EE_page_builder';

module.exports.handler = async(event) => {

    const clientID = parseInt(event.Records[0].dynamodb.Keys.clientID.N);
    const contentID = parseInt(event.Records[0].dynamodb.Keys.contentID.N);

    let navVars = {
        TableName: holderNavigationTable,
        clientID: clientID
    };

    let contentVars = {
        TableName: holderContentTable,
        clientID: clientID,
        contentID: contentID
    };

    let siteVars = {
        TableName: holderSiteTable,
        clientID: clientID
    };

    let paramsNav = {
        FunctionName: getPageDataLambda,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(navVars)
    };

    let paramsContent = {
        FunctionName: getPageDataLambda,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(contentVars)
    };

    let paramsSite = {
        FunctionName: getPageDataLambda,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(siteVars)
    };

    let returnedNavData = await lambda.invoke(paramsNav, function(err, data) {
        if (err) { throw err; }
    }).promise();
    returnedNavData = JSON.parse(returnedNavData.Payload).returnJSON;

    let returnedContentData = await lambda.invoke(paramsContent, function(err, data) {
        if (err) { throw err; }
    }).promise();
    returnedContentData = JSON.parse(returnedContentData.Payload).returnJSON;

    let returnedSiteData = await lambda.invoke(paramsSite, function(err, data) {
        if (err) { throw err; }
    }).promise();
    returnedSiteData = JSON.parse(returnedSiteData.Payload).returnJSON;

    if (returnedContentData && returnedSiteData && returnedNavData) {
        let insertExp = "set clientID = :clientID, apiUrl = :apiUrl, body = :body, clientName = :clientName, navigation = :navigation, page = :page, productionUrl = :productionUrl, template = :template";
        let insertPageParams = {
            Key: {
                "pagePath": returnedContentData.path,
                "clientUrl": returnedSiteData.url
            },
            UpdateExpression: insertExp,
            ExpressionAttributeValues: {
                ":clientID": clientID,
                ":apiUrl": returnedSiteData.apiUrl,
                ":body": [{
                    "content": returnedContentData.body,
                    "order": 1
                }],
                ":clientName": returnedSiteData.clientName,
                ":navigation": returnedNavData.navigation,
                ":page": [{
                    "desription": returnedContentData.title,
                    "exerpt": returnedContentData.exerpt,
                    "featuredImage": returnedContentData.featuredImage,
                    "title": returnedContentData.title
                }],
                ":productionUrl": returnedSiteData.productionUrl,
                ":template": returnedSiteData.template
            },
            ReturnValues: "UPDATED_NEW",
            TableName: contentTable
        };
        let insertPage = await dynamodb.update(insertPageParams).promise();
        return 'success';
    }
    else {
        return 'fail';
    }
}
