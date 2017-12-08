import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBlock, CardFooter, Button,
  Form, Input, Label, FormGroup
} from "reactstrap";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";

import { withRouter, Redirect } from "react-router-dom";

import { getUserInfo, saveUserInfo } from '../../utils/apiCalls.js';

const pie = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
};
class Settings extends Component {
  // Sample call to API for Chart data fecthing
  constructor(props) {
    super(props);

    //console.log("User Email In settings:" + JSON.stringify(this.props.location.state.useremail));
    console.log("All Props:" + JSON.stringify(this.props));
    if (this.props.location.state){
      this.email = this.props.location.state.useremail;
    }else {
      this.email = this.props.data.useremail;
    }

    console.log(this.email);
  
    this.state = {  chairID: "",
                    chairIDReadonly: false,
                    userName : "",
                    userNameReadOnly:false,
                    frequency : "",
                    frequencyReadOnly:false,
                    editDisabled: "",
                    saveDisabled : "" };
    this.populateFields = this.populateFields.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  populateFields() {
    getUserInfo(this.email).then((data) => {
      console.log(data);
      if (Object.keys(data).length > 0) {
        console.log("Found Data");
        this.setState({ chairID: data.ChairID, 
                        chairIDReadOnly : true,
                        userName: data.UserName,
                        userNameReadOnly:true,
                        frequency : data.Frequency,
                        frequencyReadOnly:true,
                        saveDisabled : "hide-link" });

      } else {
        console.log("No Data: " + JSON.stringify(data));
        this.setState({editDisabled: "hide-link"});
        //alert("Register your Chair"); // Replace with some modal
      }
    })
  }

  onClickSave() {
    console.log("Inside on click save");
    saveUserInfo(this.email, this.state.chairID, this.state.userName,this.state.frequency).then((data) => {
        console.log("saved data")
        this.setState({ userNameReadOnly: true,
          chairIDReadOnly : true, 
          frequencyReadOnly :true , 
          saveDisabled:"hide-link" , 
          editDisabled :"" 
        });
    });
  }

  onClickEdit(){
    this.setState({ userNameReadOnly: false, 
                    frequencyReadOnly :false , 
                    saveDisabled:"" , 
                    editDisabled :"hide-link" 
                  });
  }

  handleChange(event) {
    if (event.target.id === "chairID"){
      this.setState({chairID: event.target.value});
    }
    if (event.target.id === "name"){
      this.setState({userName: event.target.value});
    }
    if (event.target.id === "frequency"){
      this.setState({frequency: event.target.value});
    }
  }

  componentDidMount() {
    this.populateFields();
  }

  render() {

    return (
      <div className="flex ">

        <Row className="justify-content-center pt-3 mt-3">
          <Col md="6">
            <Card className="mt-3 pt-3 border-white" >
              <CardBlock>
                <Form className="form-horizontal">

                <FormGroup row>
                    <Col xs="12" md="4">
                      <Label htmlFor="chairID"><b>User Account</b></Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="email" value={this.email} readOnly />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs="12" md="4">
                      <Label htmlFor="chairID"><b>Chair Product ID</b></Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="chairID" placeholder="Enter Chair Product ID" value={this.state.chairID} onChange={this.handleChange} disabled={this.state.chairIDReadOnly} required />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs="12" md="4">
                      <Label htmlFor="name"> <b>Name</b></Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="name" placeholder="First and Last Name" value={this.state.userName} onChange={this.handleChange} disabled={this.state.userNameReadOnly} required />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="12" md="4">
                      <Label htmlFor="frequency"><b>Notification Frequency</b></Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="frequency" placeholder="Enter Minutes" value={this.state.frequency} onChange={this.handleChange} disabled={this.state.frequencyReadOnly} required />
                    </Col>
                  </FormGroup>
                  <Col xs="12" className="mt-3 pt-3 text-center">
                  <a href="#" className={"mt-3 btn btn-primary " + this.state.editDisabled} onClick={this.onClickEdit}> Edit </a>{''}
                  <a href="#" className={"mt-3 btn btn-primary " + this.state.saveDisabled } onClick={this.onClickSave}> Save </a>
                  </Col>
                </Form>
              </CardBlock>
            </Card>
          </Col>
        </Row>

      </div>
    )
  }
}

export default Settings;
