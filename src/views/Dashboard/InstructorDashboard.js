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
  Progress
} from 'reactstrap';

// import from antd
//import { Tabs } from 'antd';
//const TabPane = Tabs.TabPane;

// import wanted components
import SchoolPerformanceBarPlot from '../Components/InstructorStats/schoolPerformanceBarPlot';
import StudentPerformanceBarPlot from '../Components/InstructorStats/studentPerformanceBarPlot';
import YoutubeLinePlot1 from '../Components/InstructorStats/youtubeVideoStats1'
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

class InstructorDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      day: 0,
      mount: false
    };
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
                    <div id="youtube1">
                      <YoutubeLinePlot1 />
                    </div>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </div>
      )
  }
}

export default InstructorDashboard;
