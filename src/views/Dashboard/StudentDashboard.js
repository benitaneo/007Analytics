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
  CardImg,
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

// victory charts components
import * as V from 'victory';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack, VictoryCandlestick, VictoryLine } from 'victory';

// highcharts component
import StudentBoxPlot from '../Components/StudentStats/studentBoxPlot'
import PredictionLinePlot from '../Components/StudentStats/predictionLinePlot'
import StudentProgressLinePlot from '../Components/StudentStats/studentProgressLinePlot'

import firebase from '../../firebase';

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

// convert Hex to RGBA
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const daysLeft = getDaysLeft();

function getDaysLeft() {
  var today = new Date();
  var comps = new Date(2019, 2, 24);
  var one_day = 1000*60*60*24;

  var difference = Math.abs(comps.getTime() - today.getTime());
  return Math.round(difference / one_day);
}

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

const candleStickData = [
  {x: new Date(2016, 1, 1), open: 5, close: 10, high: 15, low: 0},
  {x: new Date(2016, 2, 1), open: 10, close: 15, high: 20, low: 5},
  {x: new Date(2016, 3, 1), open: 15, close: 20, high: 22, low: 10},
  {x: new Date(2016, 4, 1), open: 20, close: 10, high: 25, low: 7},
  {x: new Date(2016, 5, 1), open: 10, close: 8, high: 15, low: 5}
]

class StudentDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: 0,
      mount: false,
      completedArr: [],
      staticArr: []
    };
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('/studentInfo/completedLevelStats').on('value', (snapshot) => {
      var weeks = snapshot.val();
      var newStats = [];
      console.log(weeks);
      for (var stat in weeks) {
      newStats.push({
          week: weeks[stat]['week'],
          cohortCompleted: weeks[stat]['cohortCompleted'],
          personalCompleted: weeks[stat]['personalCompleted']
      });
      }
      this.setState({
      completedArr: newStats,
      });
    });
    db.ref('/studentInfo/staticInfo').on('value', (snapshot) => {
      console.log("got here 2")
      var staticInfo = snapshot.val();
      var newStats = []
      for (var stat in staticInfo) {
        newStats.push({
          currentLevel: staticInfo[stat]['Current level'],
          cohortAverage: staticInfo[stat]['Cohort average'],
          percentile: staticInfo[stat]['Percentile in cohort']
        });
      }
      this.setState({
        staticArr: newStats,
        mount: true,
        day: getDaysLeft()
      });
    });
  }

  render() {
    if (this.state.mount === true) {
      console.log(this.state.staticArr);
      return (
        <div className="animated fadeIn" className="boxplot">
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
                    <li>
                      <div className="text-muted">Completed</div>
                      <strong>{this.state.staticArr[0]['currentLevel']} Levels</strong>
                      <Progress className="progress-xs mt-2" color="success" value="14"/>
                    </li>
                    <li className="d-none d-md-table-cell">
                      <div className="text-muted">Cohort Average Completed</div>
                      <strong>{Math.round(this.state.staticArr[0]['cohortAverage'])} Levels</strong>
                    </li>
                    <li>
                      <div className="text-muted">Percentile (Completed Levels)</div>
                      <strong>{Math.round(this.state.staticArr[0]['percentile'])} %</strong>
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
                  <i className="fa fa-align-justify"></i> Time Performance
                </CardHeader>
                <CardBody>
                  <div id="number">
                    <PredictionLinePlot />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col sm="6">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Weekly Progression
                </CardHeader>
                <CardBody>
                  <div id="completed">
                    <StudentProgressLinePlot />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Percentile Ranking
                </CardHeader>
                <CardBody>
                <VictoryChart domainPadding={20} scale={{ x: "time" }} theme={VictoryTheme.material}>
                  <VictoryAxis label="Levels" tickFormat={(t) => `${(t.getMonth() * 10) - 9}-${t.getMonth() * 10}`} 
                    style={{axisLabel: {fontSize: 15, padding: 30}}} />
                  <VictoryAxis label="Five-Number Summary" dependentAxis 
                    style={{axisLabel: {fontSize: 15, padding: 30}}}  />
                  <VictoryCandlestick candleColors={{ positive: "#00FA9A", negative: "#c43a31" }} data={candleStickData} />
                </VictoryChart>
                </CardBody>
              </Card>
            </Col>

            <Col sm="6">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Percentile Ranking
                </CardHeader>
                <CardBody>
                  <div id="boxplot">
                    <StudentBoxPlot />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
            <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Top Selected Tech Articles for the Week
            </CardHeader>
              <CardBody>
              <Row>
                <Col xs="12" sm="6" lg="4">
                  <h2>JavaScript</h2>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/javascript/js_image1.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>🎼webpack 4: released today!!✨</CardTitle>
                      <CardText>Codename: Legato 🎶</CardText>
                      <Button href="https://medium.com/webpack/webpack-4-released-today-6cdb994702d4?source=topic_page---8------0----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/javascript/js_image2.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Elegant patterns in modern JavaScript: RORO</CardTitle>
                      <CardText>I wrote my first few lines of JavaScript not long after the language was invented. If you told me at the time that I would one day be …</CardText>
                      <Button href="https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd?source=topic_page---8------1----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/javascript/js_image3.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Straightforward code splitting with React and webpack</CardTitle>
                      <CardText>Everything seemed perfect until your app size increased too fast …</CardText>
                      <Button href="https://medium.freecodecamp.org/straightforward-code-splitting-with-react-and-webpack-4b94c28f6c3f?source=topic_page---8------0----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs="12" sm="6" lg="4">
                  <h2>Latest Technology</h2>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/tech/tech_image1.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>It’s Time to Leave San Francisco</CardTitle>
                      <CardText>That’s it. The Kevin Roose article in the New York Times did it for you. It’s time to leave San Francisco. It’s time to leave Silicon…</CardText>
                      <Button href="https://thebolditalic.com/its-time-to-leave-san-francisco-2a5a74f42433?source=topic_page---8------0----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/tech/tech_image2.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Enacting the nation’s strongest net neutrality protections in California</CardTitle>
                      <CardText>An open internet is essential to maintaining our democracy, growing our economy, protecting consumers, and preserving critical health…</CardText>
                      <Button href="https://medium.com/@Scott_Wiener/enacting-the-nations-strongest-net-neutrality-protections-in-california-bdee6bb9b3c1?source=topic_page---8------1----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/tech/tech_image3.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Can Bots Help Us Deal with Grief?</CardTitle>
                      <CardText>How simulations can bring our loved ones back to life</CardText>
                      <Button href="https://medium.com/s/when-robots-rule-the-world/can-bots-help-us-deal-with-grief-3de488cae96?source=topic_page---8------3----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>
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

export default StudentDashboard;
