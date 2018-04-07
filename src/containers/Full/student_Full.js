import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import StudentSidebar from '../../components/Sidebar/student_Sidebar';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import StudentDashboard from '../../views/Dashboard/StudentDashboard';
import InstructorDashboard from '../../views/Dashboard/InstructorDashboard';

// Icons
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';
import * as firebase from 'firebase';

// Initialize Firebase
// TODO: Replace with your project's customized code snippet

class StudentFull extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <StudentSidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/student" name="StudentDashboard" component={StudentDashboard}/>  
                
                <Redirect from="/" to="/student"/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default StudentFull;
