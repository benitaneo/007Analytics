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
import SignInLinePlot from '../Components/AdminStats/signinLinePlot'
import firebase from '../../firebase';

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
      chartsArr: [],
      day: 0,
      dropdownOpen: false,
      month: 0,
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/adminCharts').on('value', (snapshot) => {
      var charts = snapshot.val();
      console.log(charts);
      var newCharts = [];
      console.log(charts);
      for (var chart in charts) {
        newCharts.push({
          id: chart,
          chartType: charts[chart].chartType,
          data: charts[chart].data,
          style: charts[chart].style,
          title: charts[chart].title,
          xaxis: charts[chart].xaxisLabel,
          yaxis: charts[chart].yaxisLabel
        });
      }
      this.setState({
        chartsArr: newCharts,
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
      return (
        <div className="animated fadeIn">
        <Row>
          <Col sm="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Participation Rate
            </CardHeader>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Primary
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Junior
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    Senior
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}
                  >
                    Overall
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col>
                    Video ID: -L8Gz-q54aVyOc3icUgO
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col>
                    Video ID: -L8H-0i0w2y8TTccE6T2
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col>
                    Video ID: -L8H-we7JsrUikMrESh5
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col>
                    Video ID: -L8H0WhmBwqjY3FHlkv8
                    </Col>
                  </Row>
                  <SignInLinePlot />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Activity Rate
            </CardHeader>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Primary
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Junior
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    Senior
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}
                  >
                    Overall
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col>
                    Video ID: -L8Gz-q54aVyOc3icUgO
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col>
                    Video ID: -L8H-0i0w2y8TTccE6T2
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col>
                    Video ID: -L8H-we7JsrUikMrESh5
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col>
                    Video ID: -L8H0WhmBwqjY3FHlkv8
                    </Col>
                  </Row>
                  <SignInLinePlot />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AdministratorDashboard;
