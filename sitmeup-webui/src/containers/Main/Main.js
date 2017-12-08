import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import { AuthorizedRoute } from '../../AuthorizedRoute';
import { firebase, provider, auth } from '../../utils/firebase.js';
import { getUserInfo } from '../../utils/apiCalls.js';

import Dashboard from '../../views/Dashboard/';
import Settings from '../Settings';
import Logs from '../Logs';
import Recommendations from '../Recommendations';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authorized: false,
      useremail: "",
      newUser: "",
      userID: "", 
      loading: true
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        getUserInfo(user.email).then((data) => {
          if (Object.keys(data).length > 0) {
            this.setState({ authorized: true, useremail: user.email, newUser: false, userID: data.UserID, loading: false });
          } else {
            this.setState({ authorized: true, useremail: user.email, newUser: true, loading: false });
          }
        });
      } else {
        this.setState({ authorized: false, loading: false });
      }
    });

  }
  render() {
    return this.state.loading === true ? <h4>Loading </h4>
      :
      (
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar {...this.props} />
            <main className="main">
              <Container fluid>
                <Switch>
                  <AuthorizedRoute authorized={this.state.authorized} 
                                    newUser={this.state.newUser} 
                                    useremail={this.state.useremail} 
                                    userID ={this.state.userID}
                                    appUserAuthR="Jaya" 
                                    path="/dashboard" name="Dashboard" component={Dashboard} />
                  <Route path='/settings' render={(props) => (<Settings {...props} data={{useremail:this.state.useremail}}/>)} />
                  <Route path="/logs" render={(props) => (<Logs {...props} data={{useremail:this.state.useremail,userID:this.state.userID}}/>)} />
                  <Route path="/recommendations" render={(props) => (<Recommendations {...props} data={{useremail:this.state.useremail,userID:this.state.userID}}/>)} />
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Container>
            </main>
          </div>
          <Footer />
        </div>
      );
  }
}

export default Main;
