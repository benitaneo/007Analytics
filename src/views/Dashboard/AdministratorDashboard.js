import React, { Component } from 'react';
import classnames from 'classnames';

// react charts2 components
import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Nav,
  NavItem,
  NavLink,
  Input,
  Table,
  TabContent,
  TabPane
} from 'reactstrap';

// recharts components
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// import wanted components
import SignInJuniorLinePlot from '../Components/AdminStats/signinJuniorLinePlot'
import SignUpJuniorLinePlot from '../Components/AdminStats/signupJuniorLinePlot'
import SignInSeniorLinePlot from '../Components/AdminStats/signinSeniorLinePlot'
import SignUpSeniorLinePlot from '../Components/AdminStats/signupSeniorLinePlot'
import SignInPrimaryLinePlot from '../Components/AdminStats/signinPrimaryLinePlot'
import SignUpPrimaryLinePlot from '../Components/AdminStats/signupPrimaryLinePlot'
import CohortCountBarPlot from '../Components/AdminStats/cohortCountBarPlot'
import WeeklySubmitsLinePlot from '../Components/AdminStats/weeklySubmitsLinePlot'
import InstructorActivityLinePlot from '../Components/AdminStats/instructorActivityLinePlot'
import InactiveSchoolsTable from '../Components/AdminStats/inactiveSchoolsTable'
import firebase from '../../firebase';

// import material-ui
import { MuiThemeProvider } from 'material-ui/styles';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

// Dynamically update month label
const month_names = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentMonth = getMonth();

function getMonth() {
  var today = new Date();
  return month_names[today.getMonth()];
}

// Dynamically update countdown to next Singapore Coding Competition
const daysLeft = getDaysLeft();

function getDaysLeft() {
  var today = new Date();
  var comps = new Date(2019, 2, 24);
  var one_day = 1000*60*60*24;

  var difference = Math.abs(comps.getTime() - today.getTime());
  return Math.round(difference / one_day);
}

class AdministratorDashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      totalSchoolCount: 0,
      totalPrimarySchoolCount: 0,
      totalJuniorSchoolCount: 0,
      totalSeniorSchoolCount: 0,
      primarySchools: [],
      juniorSchools: [],
      seniorSchools: [],
      day: 0,
      dropdownOpen: false,
      month: 0,
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('/adminInfo/staticInfo').on('value', (snapshot) => {
      var statics = snapshot.val();
      console.log(statics);
      this.setState({
        totalPrimarySchoolCount: statics['primaryCount'],
        totalJuniorSchoolCount: statics['juniorCount'],
        totalSeniorSchoolCount: statics['seniorCount'],
        totalSchoolCount: statics['totalCount']
      })
    })
    db.ref('/adminInfo/studentsPerSchool/2018 National Coding Championships - Primary').on('value', (snapshot) => {
      var primary = snapshot.val();
      console.log(primary);
      var primaryschs = [];
      for (var sch in primary) {
        primaryschs.push({
          schoolName: primary[sch]['schoolName'],
          studentCount: primary[sch]['studentCount']
        })
      }
      this.setState({
        primarySchools: primaryschs
      })
    })
    db.ref('/adminInfo/studentsPerSchool/2018 National Coding Championships - Junior').on('value', (snapshot) => {
      var junior = snapshot.val();
      console.log(junior);
      var juniorschs = [];
      for (var sch in junior) {
        juniorschs.push({
          schoolName: junior[sch]['schoolName'],
          studentCount: junior[sch]['studentCount']
        })
      }
      this.setState({
        juniorSchools: juniorschs
      })
    })
    db.ref('/adminInfo/studentsPerSchool/2018 National Coding Championships - Senior').on('value', (snapshot) => {
      var senior = snapshot.val();
      console.log(senior);
      var seniorschs = [];
      for (var sch in senior) {
        seniorschs.push({
          schoolName: senior[sch]['schoolName'],
          studentCount: senior[sch]['studentCount']
        })
      }
      this.setState({
        seniorSchools: seniorschs,
        day: daysLeft,
        month: currentMonth,
        mount: true
      })
    });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  
  getCharts(i) {
    return this.state.chartsArr[i].data;
  }

  getTotalSchoolsCount(i) {
    var count = 0;
    for (var chart in this.state.chartsArr[i].data) {
      count += this.state.chartsArr[i].data[chart].y
    }
    return count;
  }

  render() {
    if (this.state.mount === true) {
      return (
        <MuiThemeProvider>
        <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody className="cardheader">
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Statistics</CardTitle>
                    <div className="small">April 2018</div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="cardfooter">
                <ul>
                  <li>
                    <div className="text-muted">Total</div>
                    <strong>{this.state.totalSchoolCount} Schools</strong>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Primary</div>
                    <strong>{this.state.totalPrimarySchoolCount} Schools</strong>
                  </li>
                  <li>
                    <div className="text-muted">Junior</div>
                    <strong>{this.state.totalJuniorSchoolCount} Schools</strong>
                  </li>
                  <li>
                    <div className="text-muted">Senior</div>
                    <strong>{this.state.totalSeniorSchoolCount} Schools</strong>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Countdown to Competition</div>
                    <strong>{this.state.day} Days Left</strong>
                    <Progress className="progress-xs mt-2" color="danger" value="2"/>
                  </li>
                </ul>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
          <Card>
            <CardHeader className="cardheader">
              <i className="fa fa-clone"></i> Cohort Student Count
            </CardHeader>
            <CardBody>
              <CohortCountBarPlot />
            </CardBody>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
          <Card>
            <CardHeader className="cardheader">
            <i className="fa fa-clone"></i> Cohort Submissions Count
            </CardHeader>
            <CardBody>
              <WeeklySubmitsLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
          <Card>
            <CardHeader className="cardheader">
              <i className="fa fa-clone"></i> Cohort Submissions Count
            </CardHeader>
            <CardBody>
              <InstructorActivityLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            <InactiveSchoolsTable />
          </Col>
        </Row>
        
        <Row>
          <Col sm="12">
            <h1><Badge color="primary">Senior</Badge></h1>
          </Col>
          <Col sm="6">
          <Card>
            <CardHeader className="cardheader">
            <i className="fa fa-clone"></i> Activity Rate
            </CardHeader>
            <CardBody>
             <SignInSeniorLinePlot />
            </CardBody>
          </Card>
          </Col>

          <Col sm="6">
          <Card>
            <CardHeader className="cardheader">
            <i className="fa fa-clone"></i> Adoption Rate
            </CardHeader>
            <CardBody>
              <SignUpSeniorLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            <h1><Badge color="primary">Junior</Badge></h1>
          </Col>
          <Col sm="6">
          <Card>
            <CardHeader className="cardheader">
            <i className="fa fa-clone"></i> Activity Rate
            </CardHeader>
            <CardBody>
              <SignInJuniorLinePlot />
            </CardBody>
          </Card>
          </Col>

          <Col sm="6">
          <Card>
            <CardHeader className="cardheader">
              <i className="fa fa-clone"></i> Adoption Rate
            </CardHeader>
            <CardBody>
              <SignUpJuniorLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>
        
        <Row>
          <Col sm="12">
            <h1><Badge color="primary">Primary</Badge></h1>
          </Col>
          <Col sm="6">
          <Card>
            <CardHeader className="cardheader">
              <i className="fa fa-clone"></i> Activity Rate
            </CardHeader>
            <CardBody>
              <SignInPrimaryLinePlot />
            </CardBody>
          </Card>
          </Col>

          <Col sm="6">
          <Card>
            <CardHeader className="cardheader">
            <i className="fa fa-clone"></i> Adoption Rate
            </CardHeader>
            <CardBody>
              <SignUpPrimaryLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>
      </div>
      </MuiThemeProvider>
      );
    } else {
      return null;
    }
  }
}

export default AdministratorDashboard;
