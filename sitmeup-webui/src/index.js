import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Switch} from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import {createBrowserHistory} from 'history';


// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
  // Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'

// Containers
import Main from './containers/Main/'
import Login from './containers/Login/'

const history = createBrowserHistory();

ReactDOM.render((
  //<Router history={history}>
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" name="Login Page" component={Login}/>
      <Route path="/" name="Home" component={Main}/>
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
