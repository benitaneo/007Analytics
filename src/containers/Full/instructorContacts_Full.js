import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import AdministratorSidebar from '../../components/Sidebar/administrator_Sidebar';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import AdministratorDashboard from '../../views/Dashboard/AdministratorDashboard';
import InstructorContacts from '../../views/Dashboard/InstructorContacts';

// Icons
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';

// Initialize Firebase
// TODO: Replace with your project's customized code snippet

class InstructorContactsFull extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <AdministratorSidebar {...this.props}/>
          <main className="main full-body">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/administrator" name="AdminDashboard" component={AdministratorDashboard}/>
                <Route path="/instructorcontact" name="InstructorContacts" component={InstructorContacts}/>     
                
                <Redirect from="/" to="/administrator"/>
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

export default InstructorContactsFull;
