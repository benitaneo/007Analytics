import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, Router, Redirect} from 'react-router-dom';
//import firebase from './firebase';
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
import StudentFull from './containers/Full/student_Full'
import AdministratorFull from './containers/Full/administrator_Full'
import InstructorFull from './containers/Full/instructor_Full'
import InstructorContactsFull from './containers/Full/instructorContacts_Full'
import ContactFull from './containers/Full/contact_Full'
import StudentsInformationFull from './containers/Full/students_Information_Full'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'


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
      <Route path="/instructor" name="InstructorHome" component={InstructorFull} />
      <Route path="/instructorcontact" name="InstructorContacts" component={InstructorContactsFull} />
      <Route path="/admincontact" name="AdminContact" component={ContactFull} />
      <Route path="/studentinfo" name="StudentInformationDashboard" component={StudentsInformationFull} />

      <Redirect from="/" to="/login"/>
    </Switch>
  </HashRouter>
  </div>
), document.getElementById('root'));