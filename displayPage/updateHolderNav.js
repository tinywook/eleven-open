/*
 * Filename: updateHolderNav.js
 * Lambda name: EE_update_holderNav
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
const tableName = 'holderNav';

exports.handler = function(event, context, callback) {

    console.log('event : ' + JSON.stringify(event));

    event.forEach(function(content) {

        let i = 0
		console.log('i = ' + i);
		console.log('content = ' + content)
        navArray = [];

        if (content.navigation) {
            i = 0;
            for (let navItem of content.navigation) {
                newNavItem = {
                        "order": content.navigation[i].order,
                        "navigationGroupName": content.navigation[i].navigationGroupName,
                        "displayText": content.navigation[i].displayText,
                        "altText": content.navigation[i].altText,
                        "image": content.navigation[i].image,
                        "url": content.navigation[i].url,
                        "postID": content.navigation[i].postID,
                        "parent": content.navigation[i].parent
                    },
                    navArray.push(newNavItem);
                i = ++i;
            }
        }

        let paramsDelete = {
            TableName: tableName,
            Item: {
                "clientID": content.clientID
            }
        };

        dynamodb.delete(paramsDelete, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, "Success. Deleted Navigation");
            }
        });

        let paramsAdd = {
            TableName: tableName,
            Item: {
                "clientID": content.clientID,
                "navigation": navArray
            }
        };

        dynamodb.put(paramsAdd, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, "Success. Added Navigation");
            }
        });

    });
};
