import React, { Component } from 'react';
import classnames from 'classnames';

// react charts2 components
import {
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
  Nav,
  NavLink,
  NavItem,
  Progress,
  Tab,
  TabContent,
  TabPane
} from 'reactstrap';

// import wanted components
import SchoolPerformanceBarPlot from '../Components/InstructorStats/schoolPerformanceBarPlot';
import StudentPerformanceBarPlot from '../Components/InstructorStats/studentPerformanceBarPlot';
import YoutubeLinePlot1 from '../Components/InstructorStats/youtubeVideoStats1'
import YoutubeLinePlot2 from '../Components/InstructorStats/youtubeVideoStats2'
import YoutubeLinePlot3 from '../Components/InstructorStats/youtubeVideoStats3'
import YoutubeLinePlot4 from '../Components/InstructorStats/youtubeVideoStats4'
import YoutubeLinePlot5 from '../Components/InstructorStats/youtubeVideoStats5'
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

const daysLeft = getDaysLeft();

function getDaysLeft() {
  var today = new Date();
  var comps = new Date(2019, 2, 24);
  var one_day = 1000*60*60*24;

  var difference = Math.abs(comps.getTime() - today.getTime());
  return Math.round(difference / one_day);
}

class InstructorDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      day: 0,
      mount: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    this.setState({
      day: getDaysLeft()
    });
  }

  render() {
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
                    <div className="text-muted">Total Number of Participating Students</div>
                    <strong>189</strong>
                  </li>
                  <li>
                    <div className="text-muted">Number of Students who are behind schedule</div>
                    <strong>23</strong>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Countdown to Competition</div>
                    <strong>{this.state.day} Days Left</strong>
                    <Progress className="progress-xs mt-2" color="danger" value="99"/>
                  </li>
                </ul>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> School Performance
              </CardHeader>
              <CardBody>
                <div id="number">
                  <SchoolPerformanceBarPlot />
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col sm="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Student Performance
              </CardHeader>
              <CardBody>
                <div id="levels">
                  <StudentPerformanceBarPlot />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Youtube Analytics
            </CardHeader>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Video 1
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Video 2
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    Video 3
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}
                  >
                    Video 4
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '5' })}
                    onClick={() => { this.toggle('5'); }}
                  >
                    Video 5
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
                  <YoutubeLinePlot1 />
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col>
                    Video ID: -L8H-0i0w2y8TTccE6T2
                    </Col>
                  </Row>
                  <YoutubeLinePlot2 />
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col>
                    Video ID: -L8H-we7JsrUikMrESh5
                    </Col>
                  </Row>
                  <YoutubeLinePlot3 />
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col>
                    Video ID: -L8H0WhmBwqjY3FHlkv8
                    </Col>
                  </Row>
                  <YoutubeLinePlot4 />
                </TabPane>
                <TabPane tabId="5">
                  <Row>
                    <Col>
                    Video ID: -L8PEzVB0fRyhmQAOBx1
                    </Col>
                  </Row>
                  <YoutubeLinePlot5 />
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

export default InstructorDashboard;
