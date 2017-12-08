const express = require('express');
const dynamodb = require('aws-sdk');

const router = express.Router();

// Load credentials and set region from JSON file
dynamodb.config.loadFromPath('./src/dynamodbApi/config.json');

// Create DynamoDB document client
var docClient = new dynamodb.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

router.post('/userPosture', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'User_Posture',
        ExpressionAttributeValues: {
            ':userid': webReq.body.userid,
            ':time1': webReq.body.time1, 
            ':time2': webReq.body.time2
        },
        ScanIndexForward: false, 
        KeyConditionExpression: 'UserID = :userid AND StartTime BETWEEN :time1 AND :time2 ',
        ProjectionExpression: ['StartTime', 'PostureGrade'],
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});

router.get('/userPostureCurrent', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'User_Posture',
        ExpressionAttributeValues: {
            ':userid': webReq.body.userid
        },
        Limit: 30,
        ScanIndexForward: false, 
        KeyConditionExpression: 'UserID = :userid',
        ProjectionExpression: ['StartTime', 'PostureGrade'],
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});


router.post('/postureRecommendations', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'User_Posture',
        ExpressionAttributeValues: {
            ':userid': webReq.body.userid,
            ':notSitting' : 'Not Sitting'
        },
        Limit: 20,
        ScanIndexForward: false, 
        FilterExpression: 'not (PostureGrade = :notSitting)',
        KeyConditionExpression: 'UserID = :userid',
        ProjectionExpression: ['StartTime', 'Recommendation'],
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});



router.post('/userPostureSummary', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'User_Posture_Summary',
        ExpressionAttributeValues: {
            ':userid': webReq.body.userid,
            ':summarydate': webReq.body.summarydate
        },
        KeyConditionExpression: 'UserID = :userid AND SummaryDate = :summarydate ',
        ProjectionExpression: ['PostureSummary'],
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});


router.post('/userPostureSummaryRange', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'User_Posture_Summary',
        ExpressionAttributeValues: {
            ':userid': webReq.body.userid,
            ':time1': webReq.body.time1,
            ':time2' : webReq.body.time2
        },
        KeyConditionExpression: 'UserID = :userid AND SummaryDate BETWEEN :time1 AND :time2',
        ProjectionExpression: ['SummaryDate','PostureSummary']
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});

router.post('/getUserInfo', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'Chair_Users',
        ExpressionAttributeValues: {
            ':email': webReq.body.email
        },
        KeyConditionExpression: 'User_Email = :email',
        ProjectionExpression: ['User_Email','ChairID','UserName','Frequency','UserID']
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});


router.post('/saveUserInfo', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));

    var record = {
        TableName: "Chair_Users",
        Key: {
            User_Email: webReq.body.email,
            ChairID: webReq.body.chairid
        },
        UpdateExpression: "set UserID = :userid , UserName = :name ,Frequency = :frequency ",
        ExpressionAttributeValues: {
            ":name" : webReq.body.name,
            ":userid" : 1,
            ":frequency": webReq.body.frequency
        },
        ReturnValues: "UPDATED_NEW"
    };

    docClient.update(record, function (err, data) {
        if (err) {
            console.log("Unable to Create or update record : " + err);
        }else {
            webRes.json({"result":"Success"});
        }
    });
});

router.post('/userInsights', function (webReq, webRes, next) {
    console.log("Webreq : " + JSON.stringify(webReq.body));
    var params = {
        TableName: 'User_Recommendations',
        ExpressionAttributeValues: {
            ':userid': webReq.body.userid
        },
        KeyConditionExpression: 'UserID = :userid',
        ProjectionExpression: ['Recommendations_List']
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success: ", data.Items);
            webRes.json(data.Items);
        }
    });
});


module.exports = router;

