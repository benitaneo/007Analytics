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

class AdministratorFull extends Component {
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
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/administrator" name="AdministratorDashboard" component={AdministratorDashboard}/>
                <Route path="/instructorcontact" name="Contacts" component={InstructorContacts}/> 
                
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

export default AdministratorFull;
