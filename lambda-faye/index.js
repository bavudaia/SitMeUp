'use strict';

var AWS = require("aws-sdk");
var faye = require('faye');
var moment = require('moment-timezone');

var docClient = new AWS.DynamoDB.DocumentClient();

//Create a Translator object, which comes from the DocumentClient
var dynamodbTranslator = docClient.getTranslator();

var ItemShape = docClient.service.api.operations.getItem.output.members.Item;

var postureRecord = {};

exports.handler = (event, context, callback) => {
    var client ;
    try {
        var postureSummaryData = {};
        
        client = new faye.Client('<ADD>');
        var promisePublishArray =[];
        event.Records.forEach((record) => {

            if (record.eventName === "INSERT") {
                postureRecord = dynamodbTranslator.translateOutput(record.dynamodb.NewImage, ItemShape);

                let userID = postureRecord.UserID;

                let date = moment.tz(postureRecord.StartTime, "America/Los_Angeles").format('MMDDYYYY');
                console.log(moment.tz(postureRecord.StartTime, "America/Los_Angeles").format('MMDDYYYY')); 
                let postureGrade = postureRecord.PostureGrade;
                let postureGradeDuration = postureRecord.EndTime - postureRecord.StartTime;

                promisePublishArray.push(client.publish('/posturerecord-'+userID,
                    { x: new Date(postureRecord.StartTime), y: postureGrade }
                  ));

                if (!postureSummaryData.hasOwnProperty(userID)) {
                    postureSummaryData[userID] = {};
                }

                if (!postureSummaryData[userID].hasOwnProperty(date)) {
                    postureSummaryData[userID][date] = {};
                }

                if (!postureSummaryData[userID][date].hasOwnProperty(postureGrade)) {
                    postureSummaryData[userID][date][postureGrade] = postureGradeDuration;
                } else {
                    postureSummaryData[userID][date][postureGrade] = postureSummaryData[userID][date][postureGrade] + postureGradeDuration;
                }
            }
        });

        Object.keys(postureSummaryData).forEach(function (user) {
            Object.keys(postureSummaryData[user]).forEach(function (date) {
                var params = {
                    TableName: 'User_Posture_Summary',
                    ExpressionAttributeValues: {
                        ':userid': parseInt(user),
                        ':postureDate': parseInt(date)
                    },
                    KeyConditionExpression: 'UserID = :userid AND SummaryDate = :postureDate',
                    ProjectionExpression: ['UserID', 'SummaryDate', 'PostureSummary'],
                };
                //Check if any posture Summary data is present
                docClient.query(params, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } else {
                        var record = {};
                        var updatedPostureSummaryData = { 'Very Good': 0, 'Good': 0, 'Poor': 0, 'Very Poor': 0, 'Not Sitting': 0 };
                        var oldPostureSummaryData = {};
                        var newPostureSummaryData = postureSummaryData[user][date];
                        if (data.Items.length === 0) {
                            Object.keys(newPostureSummaryData).forEach(function (posture) {
                                updatedPostureSummaryData[posture] = newPostureSummaryData[posture];
                            });
                        } else {
                            oldPostureSummaryData = data.Items[0].PostureSummary;
                            updatedPostureSummaryData = oldPostureSummaryData;
                            Object.keys(newPostureSummaryData).forEach(function (posture) {
                                updatedPostureSummaryData[posture] = updatedPostureSummaryData[posture] + newPostureSummaryData[posture];
                            });

                        }

                        record = {
                            TableName: "User_Posture_Summary",
                            Key: {
                                UserID: parseInt(user),
                                SummaryDate: parseInt(date)
                            },
                            UpdateExpression: "set PostureSummary = :posturesummary",
                            ExpressionAttributeValues: {
                                ":posturesummary": updatedPostureSummaryData
                            },
                            ReturnValues: "UPDATED_NEW"
                        };

                        docClient.update(record, function (err, data) {
                            if (err) {
                                console.log("Unable to Create or update record : " + err);
                            }
                        });
                    }
                });
            });
        });
        // Once all messages are published close the Faye client connection.
        Promise.all(promisePublishArray).then(function(result){
            client.disconnect();
        });
        
        callback(null, `Successfully processed ${event.Records.length} records.`);
        
    } catch (err) {
        client.disconnect();
        callback(err);
    }
};