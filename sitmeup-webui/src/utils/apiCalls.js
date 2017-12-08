import axios from 'axios';
import moment from 'moment';

const BASE_URL = '';

export {
  getPostureData,
  getPostureCurrentData,
  getPostureRecommendation,
  getPostureSummary,
  getPostureSummaryRange,
  getUserInfo,
  saveUserInfo,
  getInsights
};

function getPostureData(userid, time1, time2) {
  const url = `${BASE_URL}/userPosture`;
  var postureData = [];
  return axios.post(url, { 'userid': userid, 'time1': time1, 'time2': time2 }).then(function (response) {
    response.data.forEach(function (data) {
      postureData.push({ x: new Date(data.StartTime), y: data.PostureGrade });
    });
    return postureData;
  });
}

function getPostureCurrentData(userid, time1, time2) {
  const url = `${BASE_URL}/userPostureCurrent`;
  var postureData = [];
  return axios.post(url, { 'userid': userid }).then(function (response) {
    response.data.forEach(function (data) {
      postureData.push({ x: new Date(data.StartTime), y: data.PostureGrade });
    });
    return postureData;
  });
}

function getPostureRecommendation(userid) {
  const url = `${BASE_URL}/postureRecommendations`;
  var postureRecommendation = [];
  return axios.post(url, { 'userid': userid }).then(function (response) {
    response.data.forEach(function (data) {
      postureRecommendation.push({ x: new Date(data.StartTime), y: data.Recommendation });
    });
    return postureRecommendation;

  });
}

function getPostureSummary(userid, summarydate) {
  const url = `${BASE_URL}/userPostureSummary`;
  var postureSummary = {};
  return axios.post(url, { 'userid': userid, 'summarydate': summarydate }).then(function (response) {
    response.data.forEach(function (data) {
      let verygood = data.PostureSummary['Very Good'];
      let good = data.PostureSummary['Good'];
      let poor = data.PostureSummary['Poor'];
      let verypoor = data.PostureSummary['Very Poor'];

      postureSummary.chartData = [verygood, good, poor, verypoor]; // in ms
      postureSummary.sitting = convertMStoString(verygood + good + poor + verypoor);
      postureSummary.notsitting = convertMStoString(data.PostureSummary['Not Sitting']);

      postureSummary.verygood = convertMStoString(verygood);
      postureSummary.good = convertMStoString(good);
      postureSummary.poor = convertMStoString(poor);
      postureSummary.verypoor = convertMStoString(verypoor);
    });
    console.log(postureSummary)
    return postureSummary;

  });
}

function getPostureSummaryRange(userid, time1, time2) {
  const url = `${BASE_URL}/userPostureSummaryRange`;

  var postureSummary = {};
  let date = [];
  let verygood = [];
  let good = [];
  let poor = [];
  let verypoor = [];

  return axios.post(url, { 'userid': userid, 'time1': time1, 'time2': time2 }).then(function (response) {
    console.log("got Resposne");
    response.data.forEach(function (data) {
      date.push(moment(data.SummaryDate, 'YYYYMMDD').format('MMM DD'));
      verygood.push(roundNumber(data.PostureSummary['Very Good'] / 3600000, 2));
      good.push(roundNumber(data.PostureSummary['Good'] / 3600000, 2));
      poor.push(roundNumber(data.PostureSummary['Poor'] / 3600000, 2));
      verypoor.push(roundNumber(data.PostureSummary['Very Poor'] / 3600000, 2));
    });
    postureSummary = { 'date': date, 'verygood': verygood, 'good': good, 'poor': poor, 'verypoor': verypoor };
    console.log(postureSummary)
    return postureSummary;
  });
}


function getUserInfo(email) {
  const url = `${BASE_URL}/getUserInfo`;

  return axios.post(url, { 'email': email }).then(function (response) {
    console.log("got Response");
    var userData = {};
    response.data.forEach(function (data) {
      userData = data;
    });

    return userData;
  });
}

function saveUserInfo(email, chairid, name, frequency) {
  const url = `${BASE_URL}/saveUserInfo`;

  return axios.post(url, { 'email': email, 'chairid': chairid, 'name': name, 'frequency': frequency }).then(function (response) {
    return response.data;
    
  });
}

function getInsights(userid) {
  const url = `${BASE_URL}/userInsights`;

  return axios.post(url, { 'userid': userid }).then(function (response) {
    var userData = {};
    response.data.forEach(function (data) {
      userData = data;
      console.log(userData);
    });
    return userData;
    
  });
}

function convertMStoString(timeinms) {
  let duration = moment.duration(timeinms);
  let timeString = (duration.hours() > 0 ? duration.hours() + "hr " : "") +
    (duration.minutes() > 0 ? duration.minutes() + "min " : "");
  return (timeString === "") ? "0mins" : timeString;
} 

function roundNumber(number, precision) {
  precision = Math.abs(parseInt(precision)) || 0;
  var multiplier = Math.pow(10, precision);
  return (Math.round(number * multiplier) / multiplier);
}