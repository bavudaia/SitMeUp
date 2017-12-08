import React, { Component } from 'react';
import { withRouter, Redirect } from "react-router-dom";
import moment from 'moment';
import {
    Row, Col, Card, CardHeader, CardBlock, CardBody, CardTitle, CardFooter,
    Button, Table, ButtonToolbar, ButtonGroup, FormGroup, Label, Input
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import {
    getPostureData, getPostureSummary,
    getPostureCurrentData, getPostureRecommendation
} from '../../utils/apiCalls.js';
import { firebase, provider, auth } from '../../utils/firebase.js';

import faye from 'faye';
//import * as zoom from 'chartjs-plugin-zoom';

var client = new faye.Client(<ADD>);

const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

// Line Chart containing user posture data
var postureChartOpts = {
    // responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
        position: 'bottom',
        usePointStyle: true,
        padding: 12
    },
    scales: {
        xAxes: [{
            type: "time",
            distribution: 'series',
            time: {
                tooltipFormat: "MMM D, h:mm:ss a",
                minUnit: 'minute',
                stepSize : 5,
                displayFormats: {
                    minute: 'h:mm A'
                }
            },
            ticks: {
                source: 'data',
                reverse: false,
                fontStyle: 'bold italic',
                fontSize: 13,
                autoSkip: true,
                maxTicksLimit: 7,
                minRotation: 30
            },
            gridLines: {
                drawOnChartArea: false,
                zeroLineWidth: 2
            }
        }],
        yAxes: [{
            type: 'category',
            position: 'left',
            display: true,
            drawTicks: false,
            scaleLabel: {
                display: true,
                labelString: 'Postures',
                fontSize: 15,
                fontStyle: 'bold italic',
                padding:6
            },
            ticks: {
                reverse: false,
                fontStyle: 'bold italic',
                fontSize: 14,
            },
            gridLines: {
                drawBorder: false,
                drawOnChartArea: true,
                color: [, brandWarning, brandDanger,],
                zeroLineColor: brandSuccess
            }
        }]
    },
    elements: {
        point: {
            radius: 0,
            hitRadius: 10,
        }
    },
    pan :{
        enabled: true,
        mode:'x'
    },
    zoom :{
        enabled:true,
        drag:true,
        mode:'x'
    }
}

const summaryChartOpts = {
    legend: { position: 'right' },
    tooltips: { enabled: false }
}

class Dashboard extends Component {
    //Sample call to API for Chart data fecthing
    constructor(props) {
        super(props)
        this.state = {
            PostureChartData: [],
            userName: null,
            PostureRecommendation: [],
            PostureSummaryChartData: [],
            current: "active",
            day: ""
        };
        this.user = this.props.appUser;
        console.log("App User : " +this.user);
        console.log("User ID:"+ this.props.userID);
        this.userid= this.props.userID;
        this.postureChart={};
        this.getChartsInfo = this.getChartsInfo.bind(this);
        this.postureChartPeriod = this.postureChartPeriod.bind(this);
    }

    getChartsInfo() {

        // Fetch Posture Line Chart Data
        getPostureCurrentData(this.userid).then((data) => {
            this.setState({ PostureChartData: data });
        });
        var postureDataChartInstance = this.refs.postureLineChart.chart_instance;
        client.subscribe('/posturerecord-1', function (data) {
            postureDataChartInstance.data.datasets[0].data.unshift({"x":new Date(data.x),"y":data.y});
            postureDataChartInstance.update();
        });

        // Fetch Posture Recommendation Table Data
        getPostureRecommendation(this.userid).then((recommendation) => {
            this.setState({ PostureRecommendation: recommendation });
            console.log("Posture Recommendation table Data:" + JSON.stringify(this.state.PostureRecommendation));
        });

        // Fetch Posture Summary Pie Chart Data
        getPostureSummary(this.userid,  parseInt(moment().format("YYYYMMDD"))).then((postureSummary) => {
            console.log("Posture Summary: " + JSON.stringify(postureSummary));
            this.setState({ PostureSummaryChartData: postureSummary });
        });
    }

    // Updates Posture Chart Data as per Chart Selection (Current, Hour, Day)
    postureChartPeriod(event) {
        console.log("Line Chart Period Options: " + event.target.id);
        this.setState({ current: "", day: ""});
        if (event.target.id === "current") {
            this.setState({ current: "active" });
            postureChartOpts.scales.xAxes[0].time.stepSize = 5;
            getPostureCurrentData(this.userid).then((data) => {
                this.setState({ PostureChartData: data });
            });
            console.log(this.state);
        }
        if (event.target.id === "day") {
            this.setState({ day: "active" });
            console.log(this.state);
            var time1 = new Date(new Date().toDateString()).getTime(); // today start and end 
            var time2 = time1 + 86400000 - 1;
        
            postureChartOpts.scales.xAxes[0].time.stepSize = 0;
            getPostureData(this.userid, time1, time2).then((chartData) => {
                this.setState({ PostureChartData: chartData });
                console.log(JSON.stringify(this.state.PostureChartData));
            });
        }
    }

    componentDidMount() {
        console.log("AppUser from Props : " + JSON.stringify(this.props.appUser));

        this.setState({ userName: this.props.appUser });
        // Populates the default Chart data on page load
        this.getChartsInfo();
    }

    render() {
        var utcDate = new Date(new Date().toUTCString()).toDateString();
        console.log("Today's Date in ms: "+ moment().format("MMDDYYYY"));
        
        console.log("Chart Data Inside render of Dashboard" + JSON.stringify(this.state.PostureChartData));
        var user = this.state.user;

        this.postureChart = {
            yLabels: ['Very Good', 'Good', 'Poor', 'Very Poor', 'Not Sitting'],
            datasets: [
                {
                    label: 'Your Posture',
                    steppedLine: 'after',
                    backgroundColor: 'transparent',
                    borderColor: brandInfo,
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBorderWidth: 5,
                    pointRadius: 4,
                    pointStyle: 'rectRounded',
                    pointHitRadius: 5,
                    pointHoverBackgroundColor: '#fff',
                    borderWidth: 3,
                    data: this.state.PostureChartData
                }
            ]
        }

        let summaryChart = {
            labels: [
                'Very Good',
                'Good',
                'Poor',
                'Very Poor'
            ],
            datasets: [{
                data: this.state.PostureSummaryChartData.chartData,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#000'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#000'
                ]
            }]
        };

        return (
            <div className="animated fadeIn pt-3">
                <Row>
                    <Col xs="12" lg="8" className="text-muted">
                        <Row>
                            <Col xs="12">
                                <Card className="card-accent-info border-info">
                                    <CardHeader className="text-white bg-info" >
                                        <Row>
                                            <Col sm="6" >
                                                <CardTitle className="mb-0" tag="h3">Posture</CardTitle>
                                                <div className="medium text-muted">{moment(Date.now()).format('MMMM Do, YYYY')}</div>
                                            </Col>
                                            <Col sm="6">
                                                <ButtonGroup className="float-right text-white mr-3 mt-3" onClick={this.postureChartPeriod}>
                                                    <Button id="current" outline color="white" className={this.state.current}>Current</Button>
                                                    <Button id="day" outline color="white" className={this.state.day}>Day</Button>
                                                </ButtonGroup>

                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBlock className="card-body" >
                                        <div className="chart-wrapper" style={{ height: 200 + 'px', marginTop: 20 + 'px' }}>
                                            <Line ref="postureLineChart" data={this.postureChart} options={postureChartOpts} height={200} />
                                        </div>
                                    </CardBlock>
                                </Card>
                            </Col>
                            {/* Posture Summary Pie Chart*/}
                            <Col xs="12" lg={{ size: 8, offset: 2 }}>
                                <Card className="card-accent-warning border-warning"  >
                                    <CardBlock className="card-body" >
                                        <Col xs="12" >
                                            <CardTitle>Posture Summary</CardTitle>
                                        </Col>
                                        <Col xs="12">
                                            <div className="chart-wrapper">
                                                <Pie data={summaryChart} options={summaryChartOpts} />
                                            </div>
                                        </Col>
                                    </CardBlock>
                                    <CardFooter>
                                        <Row >
                                            <Col xs="3" >
                                                <Row>
                                                    <Col xs="12" className="text-center"><b>Very Good</b></Col>
                                                    <Col className="text-center">{this.state.PostureSummaryChartData.verygood}</Col>
                                                </Row>
                                            </Col>
                                            <Col xs="3" >
                                                <Row>
                                                    <Col xs="12" className="text-center"><b>Good</b></Col>
                                                    <Col className="text-center">{this.state.PostureSummaryChartData.good}</Col>
                                                </Row>
                                            </Col>
                                            <Col xs="3" >
                                                <Row>
                                                    <Col xs="12" className="text-center"><b>Poor</b></Col>
                                                    <Col className="text-center">{this.state.PostureSummaryChartData.poor}</Col>
                                                </Row>
                                            </Col>
                                            <Col xs="3" >
                                                <Row>
                                                    <Col xs="12" className="text-center"><b>Very Poor</b></Col>
                                                    <Col className="text-center">{this.state.PostureSummaryChartData.verypoor}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col xs="6" className="text-center"><b>Sitting </b>{this.state.PostureSummaryChartData.sitting}
                                            </Col>
                                            <Col xs="6" className="text-center"><b>Not Sitting </b>{this.state.PostureSummaryChartData.notsitting}
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    {/* Posture Recommendation Table */}
                    <Col xs="12" lg="4"  >
                        <Card style={{ "maxHeight": "100vh", "overflowY": "auto" }}>
                            <CardHeader className="text-white bg-gray" tag="h5">
                                Recommendations
                            </CardHeader>
                            <CardBlock className="card-body">
                                <Table responsive reflow striped size="sm">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Recommendation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.PostureRecommendation.map((row, i) =>
                                            (<tr key={i}>
                                                <td style={{ width: '40%' }} key={i + 'time'}>{moment(row.x).format('MMM DD YYYY hh:mm:ss a')}</td>
                                                <td key={i + 'rec'}><i>{row.y}</i></td>
                                            </tr>)
                                        )}
                                    </tbody>
                                </Table>
                            </CardBlock>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
