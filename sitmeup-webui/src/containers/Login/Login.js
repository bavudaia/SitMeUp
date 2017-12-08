import React, { Component } from "react";
import { Container, Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon,NavbarBrand } from "reactstrap";
import { firebase, provider, auth } from '../../utils/firebase.js';
import { Redirect } from 'react-router-dom';
import Footer from '../../components/Footer/';


class Login extends Component {
  constructor(history) {
    super();
    this.state = {
      username: ''
    }
    this.loggedIn = this.loggedIn.bind(this);
  }

  loggedIn() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        console.log("Logged In", user);
        this.props.history.push('/dashboard');
      });
  }



  render() {
    return (
    <div className="app">
      <header className="app-header navbar ">
        <NavbarBrand href="#" >
          <img src="/img/logo-sitmeup.png" width="30" height="30" alt="Sit Me up Logo"/>
          <span className="h4"><strong>SitMeUp</strong></span>
        </NavbarBrand>
      </header>
       <div className="app-body flex-row align-items-center">
        <Container>
          <Row className= "justify-content-center">
            <Col md="6" xs="12">
              <div >
                <h1 className="text-primary">Maintain Good Posture with SitMeUp</h1>
                <br></br>
                <p className="lead">SitMeUp detects your sitting posture and notifies in real-time about your bad posture. </p>
                <br></br>
              </div>
            </Col>
            <Col md="1" className="vertical-divider"></Col>
            <Col md="1" sm="12"></Col>
            <Col md="4" xs="12">
              <br/>
              <Button  className="mb-4 btn-google" size="lg" block onClick={this.loggedIn}>Log In with Google </Button>
              <br/>
              <p className="text-center"><b>Not a user, yet ?</b></p>
              <Button className="mb-4 btn-google" size="lg" block onClick={this.loggedIn}>Register with Google</Button>
              <span className="text-muted">By clicking Register, I agree to the Terms of Service and Privacy Policy.</span>
            </Col>

          </Row>
        </Container>
      </div>
      <Footer />
    </div>
    );
  }
}

export default Login;
