import React, { Component } from 'react';
import classnames from 'classnames';
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

import firebase from '../../firebase';
import store from '../../store';
import RechartsComp from './RechartsChart';

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

const daysLeft = getDaysLeft();

function getDaysLeft() {
  var today = new Date();
  var comps = new Date(2018, 2, 24);
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
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/newCharts').on('value', (snapshot) => {
      //console.log(snapshot.val());
      var charts = snapshot.val();
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

  render() {
    //console.log(this.state.chartsArr);
    //console.log(this.state.chartsArr[0]);
    if (this.state.mount === true) {
      var wanted = this.state.chartsArr[0].data;
      //console.log(this.state.chartsArr[0].data);
      //console.log(this.state.chartsArr[0].data[0]);
      //console.log(this.state.chartsArr[0].data[0].x);
      return (
        <div className="animated fadeIn">

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col sm="5">
                      <CardTitle className="mb-0">Statistics</CardTitle>
                      <div className="small text-muted">March 2018</div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <ul>
                    <li className="d-none d-md-table-cell">
                      <div className="text-muted">Total Number of Participating Schools</div>
                      <strong>39</strong>
                    </li>
                    <li>
                      <div className="text-muted">Number of Schools currently in Talks with</div>
                      <strong>17</strong>
                    </li>
                    <li className="d-none d-md-table-cell">
                      <div className="text-muted">Countdown to Competition</div>
                      <strong>{this.state.day} Days Left (99%)</strong>
                      <Progress className="progress-xs mt-2" color="danger" value="99"/>
                    </li>
                  </ul>
                </CardFooter>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Participation Rate
                  <div className="small text-muted">March 2018</div>
                </CardHeader>
                <CardBody>
                  <Row>
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
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="1">
                        <Row>
                          <Col sm="6">
                          <BarChart width={400} height={200} data={this.getCharts(0)}>
                            <XAxis
                              dataKey="x"
                              label={
                                <AxisLabel axisType="xAxis" width={600} height={300}>
                                  {this.state.chartsArr.xaxis}
                                </AxisLabel>
                              }
                            />
                            <YAxis
                              dataKey="y"
                              label={
                                <AxisLabel axisType="yAxis" width={600} height={300}>
                                  {this.state.chartsArr.yaxis}
                                </AxisLabel>
                              }
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="y" fill="#8884d8" />
                          </BarChart>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="2">
                      <Row>
                        <Col sm="6">
                          <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row>
                        <Col sm="6">
                          <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    </TabContent>
                  </Row>           
                </CardBody>
              </Card>
            </Col>
  
            <Col lg="6">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Activity Rate
                  <div className="small text-muted">March 2018</div>
                </CardHeader>
                <CardBody>
                  <Row>
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
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                      <Row>
                        <Col sm="6">
                          <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="6">
                          <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row>
                        <Col sm="6">
                          <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                  </Row>
                  <Row>
                  </Row>
  
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default AdministratorDashboard;
