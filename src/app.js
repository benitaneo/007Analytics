import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Router, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initializeFirebase } from './reducers/data_reducer';

// Containers
import StudentFull from './containers/Full/student_Full'
import AdministratorFull from './containers/Full/administrator_Full'
import InstructorFull from './containers/Full/instructor_Full'
import CodeCombatProgressFull from './containers/Full/forum_Full'
import ContactFull from './containers/Full/contact_Full'
import StudentsInformationFull from './containers/Full/students_Information_Full'
import { getData } from './actions/get_data'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

class App extends Component {
  componentDidMount() {
    if (this.props.fetchAdminData !== 'FETCHED') {
      console.log("got here!");
      this.props.initializeFirebase();
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/login" name="Login Page" component={Login}/>
        <Route exact path="/404" component={Page404}/>
        <Route exact path="/500" component={Page500}/>
        <Route exact path="/student" name="StudentHome" render{...props => StudentFull} />
        <Route exact path="/administrator" name="AdministratorHome" render{...props => AdministratorFull} />
        <Route exact path="/instructor" name="InstructorHome" render{...props => InstructorFull} />
        <Route exact path="/forum" name="Forum" render{...props => CodeCombatProgressFull} />
        <Route exact path="/admincontact" name="AdminContact" render{...props => ContactFull} />
        <Route exact path="/studentinfo" name="StudentInformationDashboard" render{...props => StudentsInformationFull} />

        <Redirect from="/" to="/login"/>
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  fetchAdminData: state.firebase.fetchAdminData,
  fetchInstructorData: state.firebase.fetchInstructorData,
  fetchStudentData: state.firebase.fetchStudentData
})

const mapDispatchToProps = dispatch => bindActionCreators({
  initializeFirebase
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));