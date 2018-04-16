import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import InstructorSidebar from '../../components/Sidebar/instructor_Sidebar';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import InstructorDashboard from '../../views/Dashboard/InstructorDashboard';
import StudentInfoDashboard from '../../views/Dashboard/StudentInfoDashboard';

class InstructorFull extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.data);
    //this.props.getData();
  }

  render() {
    console.log(this.props);
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
                <Route path="/studentinfo" name="StudentInfoDashboard" component={StudentInfoDashboard}/>
                    
                <Redirect from="/" to="/instructor"/>
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

export default InstructorFull;
