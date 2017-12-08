import React, { Component } from 'react';
import {
  Nav,
  NavItem,
  NavbarToggler,
  NavbarBrand,
} from 'reactstrap';

import { firebase, provider, auth } from '../../utils/firebase.js';

class Header extends Component {

  constructor(props){
    super(props)
    this.logOut = this.logOut.bind(this);
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  logOut(){
    firebase.auth().signOut().then(function() {
      console.log("signout successful");
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      console.log("signout error:" + error);
    });
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
        <NavbarBrand href="#" >
          <img src="/img/logo-sitmeup.png" width="30" height="30" alt="Sit Me up Logo"/>
          <span className="h5"><strong>SitMeUp</strong></span>
        </NavbarBrand>
        <span onClick={this.logOut}><b>SignOut</b></span>
      </header>
    )
  }
}

export default Header;
