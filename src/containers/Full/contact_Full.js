import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import InstructorSidebar from '../../components/Sidebar/instructor_Sidebar';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import InstructorDashboard from '../../views/Dashboard/InstructorDashboard';
import ContactDashboard from '../../views/Dashboard/ContactDashboard';
import Widgets from '../../views/Widgets/';

// Icons
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';
import * as firebase from 'firebase';

// Initialize Firebase
// TODO: Replace with your project's customized code snippet

class ContactFull extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="app full-font">
        <Header />
        <div className="app-body">
          <InstructorSidebar {...this.props}/>
          <main className="main full-body">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/instructor" name="InstructorDashboard" component={InstructorDashboard}/>
                <Route path="/admincontact" name="ContactDashboard" component={ContactDashboard}/>
                
                <Redirect from="/" to="/admincontact"/>
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

export default ContactFull;
