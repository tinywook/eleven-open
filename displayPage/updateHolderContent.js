/*
* Filename: updateHolderContent.js
* Lambda name: EE_update_holderContent
* Project:  EEOpen_pageBuilder
* Maintainer: Jon Stephenson jstephenson@commercialnoise.com
* Node ver: 10.x
*
* Write to holderNav table in dynamo from wordpress
*/

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'holderContent';

module.exports.handler = async(event) => {

	if (event[0]) {

        let insertExp = "set pagePath = :pagePath, body = :body, exerpt = :exerpt, featuredImage = :featuredImage, title = :title, parent = :parent";
        let insertPageParams = {
            Key: {
                "clientID": event[0].clientID,
				"contentID": event[0].contentID,
            },
            UpdateExpression: insertExp,
            ExpressionAttributeValues: {
                ":pagePath": event[0].path,
                ":body": event[0].body,
                ":exerpt": event[0].exerpt,
                ":featuredImage": event[0].featuredImage,
                ":title": event[0].title,
                ":parent": event[0].parent
            },
            ReturnValues: "UPDATED_NEW",
            TableName: tableName
        };

        let insertPage = await dynamodb.update(insertPageParams).promise();
		return insertPage;
	}
};
