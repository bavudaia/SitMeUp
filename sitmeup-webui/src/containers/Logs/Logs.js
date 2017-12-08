import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody, CardBlock, CardTitle, Button,
  Form, FormGroup, Label, Input
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";

import { withRouter, Redirect } from "react-router-dom";

import { getPostureSummaryRange } from '../../utils/apiCalls.js';
import moment from 'moment';


var barChartOpts = {
  animation: { duration: 500 },
  legend: {
    position: 'bottom',
    labels: { fontStyle: 'bold', padding: 20 }
  },
  maintainAspectRatio: false,
  tooltips: { mode: 'index' },
  scales: {
    xAxes: [{
      stacked: true,
      ticks: { fontStyle: 'bold' }
    }],
    yAxes: [{
      stacked: true,
      ticks: {
        beginAtZero: true,
        fontStyle: 'bold'
      },
      scaleLabel: {
        display: true,
        labelString: 'Hours',
        fontSize: 15,
        fontStyle: 'bold italic',
        padding: 6
      }

    }]
  }
};

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyChartData: {},
      weekStart: moment().subtract(8, 'days').format('YYYY-MM-DD'),
      weekEnd: moment().subtract(1, 'days').format('YYYY-MM-DD')
    };
    console.log("All Props:" + JSON.stringify(this.props));
    this.user = this.props.appUser;
    this.userid= this.props.data.userID;
    this.getChartsInfo = this.getChartsInfo.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(event) {
    if (event.target.id === "date1") {
      this.setState({ weekStart: event.target.value });
    }else if (event.target.id === "date2") {
      this.setState({ weekEnd: (event.target.value) });
    }
  }

  getChartsInfo() {

    let startDate = parseInt(moment(this.state.weekStart, 'YYYY-MM-DD').format('YYYYMMDD'));
    let endDate = parseInt(moment(this.state.weekEnd, 'YYYY-MM-DD').format('YYYYMMDD'));

    getPostureSummaryRange(this.userid, startDate, endDate).then((data) => {
      this.setState({ historyChartData: data });
      console.log(data);
    });
  }

  componentDidMount() {
    console.log("AppUser from Props : " + JSON.stringify(this.props.appUser));
    this.setState({ userName: this.props.appUser });
    this.getChartsInfo();
  }

  render() {

    var bar = {
      labels:this.state.historyChartData.date,
      datasets: [
        {
          label: 'Very Good',
          backgroundColor: "rgb(255, 99, 132)",
          borderWidth: 1,
          data:this.state.historyChartData.verygood
        },
        {
          label: 'Good',
          backgroundColor: "rgb(54, 162, 235)",
          borderWidth: 1,
          data:this.state.historyChartData.good
        },
        {
          label: 'Poor',
          backgroundColor: "rgb(75, 192, 192)",
          borderWidth: 1,
          data:this.state.historyChartData.poor
        },
        {
          label: 'Very Poor',
          backgroundColor: "rgb(255, 205, 86)",
          borderWidth: 1,
          data:this.state.historyChartData.verypoor
        }
      ]
    };

    return (
      <div className="fadeIn pt-3" >
        <Row>
          <Col xs="12">
            <Card className="card-accent-success border-success">
              <CardHeader className="bg-success border-success">
                <Row>
                  <Col xs="12" md="7" className="pb-2" >
                    <CardTitle className="mb-0">Posture Summary</CardTitle>

                  </Col>

                  <Col xs ="12" sm ="5" md="2" className="pb-2">
                    <Input type="date" name="date1" id="date1" placeholder="date placeholder" size="sm" value={this.state.weekStart} onChange={this.handleDateChange} />
                  </Col>
                  <Col xs="12" sm="5" md="2" className="pb-2">
                    <Input type="date" name="date2" id="date2" placeholder="date placeholder" size="sm" value={this.state.weekEnd} onChange={this.handleDateChange} />
                  </Col>
                  <Col xs="12" sm="2" md="1" >
                    <Button outline color="white" className="mt-0 font-weight-bold" size="sm" onClick={this.getChartsInfo}>Submit</Button>
                  </Col>

                </Row>
              </CardHeader>
              <CardBlock className="card-body">
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 20 + 'px' }} >
                  <Bar data={bar} height={300} options={barChartOpts} />
                </div>
              </CardBlock>
            </Card>

          </Col>

        </Row>
      </div>
    )
  }
}

export default Logs;
