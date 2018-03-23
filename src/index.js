import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import firebase from './firebase';
import store from './store';
// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

// Containers
import Full from './containers/Full/'
import StudentFull from './containers/Full/student_Full'
import AdministratorFull from './containers/Full/administrator_Full'
import ForumFull from './containers/Full/forum_Full'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

var local_data = {}

ReactDOM.render((
  <div>
  <HashRouter>
    <Switch>
      <Route exact path="/login" name="Login Page" component={Login}/>
      <Route exact path="/register" name="Register Page" component={Register}/>
      <Route exact path="/404" name="Page 404" component={Page404}/>
      <Route exact path="/500" name="Page 500" component={Page500}/>
      <Route path="/original" name="Login" component={Login} />
      <Route path="/student" name="StudentHome" component={StudentFull} />
      <Route path="/administrator" name="AdministratorHome" component={AdministratorFull} />
      <Route path="/forum" name="Forum" component={ForumFull} />
      <Route path="/dashboard" name="Home" component={Full} />
      
      // <Route path="/home" name="Home" component={Full} sample={local_data}/>
      <Route path="/" name="Home" component={Login} sample={local_data}/>
      <Route path="/" name="Home" render={props => <Full local_data={local_data} {...props} />} />
    </Switch>
  </HashRouter>
  </div>
), document.getElementById('root'));
