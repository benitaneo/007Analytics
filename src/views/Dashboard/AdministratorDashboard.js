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

// convert Hex to RGBA
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

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

const AxisLabel = ({
  axisType,
  x = 0,
  y = 0,
  width,
  height,
  stroke,
  children
}) => {
  const isVert = axisType === "yAxis";
  const cx = isVert ? x + 20 : x + width / 2;
  const cy = isVert ? height / 2 + y : y + height;
  const rot = isVert ? `270 ${cx} ${cy}` : 0;
  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rot})`}
      textAnchor="middle"
      stroke={stroke}
    >
      {children}
    </text>
  );
};

class AdministratorDashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
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
    db.ref('/cohorts/all_schools').on('value', (snapshot) => {
      var schools = snapshot.val();
      console.log(schools);
      var allSchools = [];
      for (var cat in schools) {
        if (cat == 'junior') {
          for (var sch in schools[cat]) {
            this.state.juniorSchools.push(schools[cat][sch]);
          }
        } else if (cat == 'primary') {
          for (var sch in schools[cat]) {
            this.state.primarySchools.push(schools[cat][sch]);
          }
        } else if (cat == 'senior') {
          for (var sch in schools[cat]) {
            this.state.seniorSchools.push(schools[cat][sch]);
          }
        }
      }
      this.setState({
        day: daysLeft,
        month: currentMonth,
        mount: true
      });
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
          <h1><Badge color="primary">Senior</Badge></h1>
        </Row>
        <Row>
          <Col sm="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Participation Rate
            </CardHeader>
            <CardBody>
             <SignInSeniorLinePlot />
            </CardBody>
          </Card>
          </Col>

          <Col sm="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Activity Rate
            </CardHeader>
            <CardBody>
              <SignUpSeniorLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>

        <Row>
          <h1><Badge color="primary">Junior</Badge></h1>
        </Row>  
        <Row>
          <Col sm="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Participation Rate
            </CardHeader>
            <CardBody>
              <SignInJuniorLinePlot />
            </CardBody>
          </Card>
          </Col>

          <Col sm="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Activity Rate
            </CardHeader>
            <CardBody>
              <SignUpJuniorLinePlot />
            </CardBody>
          </Card>
          </Col>
        </Row>
        
        <Row>
          <h1><Badge color="primary">Primary</Badge></h1>
        </Row>
        <Row>
          <Col sm="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Participation Rate
            </CardHeader>
            <CardBody>
              <SignInPrimaryLinePlot />
            </CardBody>
          </Card>
          </Col>

          <Col sm="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Activity Rate
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
