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

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

// highcharts component
import StudentBoxPlot from '../Components/StudentStats/studentBoxPlot'
import PercentileLinePlot from '../Components/StudentStats/percentileLinePlot'
import StudentProgressLinePlot from '../Components/StudentStats/studentProgressLinePlot'

import firebase from '../../firebase';

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

class StudentDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: 0,
      month: "",
      mount: false,
      predictedData: [],
      flaggedArr: [],
      staticArr: []
    };
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('/studentInfo/flaggedLevels').on('value', (snapshot) => {
      var flagged = snapshot.val();
      var newStats = [];
      console.log(flagged);
      for (var stat in flagged) {
        newStats.push({
          levelName: flagged[stat]['levelName'],
          levelNumber: flagged[stat]['levelNumber'],
          levelPercentile: flagged[stat]['levelPercentile'],
          levelTopic: flagged[stat]['levelTopic'],
          topicReadUp: flagged[stat]['enrichmentLink']['w3']
        });
      }
      this.setState({
        flaggedArr: newStats,
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
          percentile: Math.round(staticInfo[stat]['Percentile in cohort']),
          unwatchedVideo: staticInfo[stat]['Unwatched Video']
        });
      }
      this.setState({
        staticArr: newStats
      });
    });
    db.ref('/studentInfo/predictedTimings').on('value', (snapshot) => {
      var predicted = snapshot.val();
      var newStats = [];
      newStats.push(predicted['levelName'], predicted['levelNumber'], predicted['predictedTime']);
      this.setState({
        predictedData: newStats,
        month: currentMonth,
        mount: true,
        day: getDaysLeft()
      });
    })
  }

  render() {
    if (this.state.mount === true) {
      console.log(this.state.staticArr);
      return (
        <div className="animated fadeIn" className="boxplot">
          <Row>
            <Col>
              <Card>
                <CardBody className="cardheader">
                  <Row>
                    <Col sm="5">
                      <CardTitle className="mb-0">Statistics</CardTitle>
                      <div className="small">{this.state.month} 2018</div>
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
                      <Progress className="progress-xs mt-2" color="danger" value="2"/>
                    </li>
                  </ul>
                </CardFooter>
                
                <CardFooter>
                  <ul>
                  <li>
                    <div className="text-muted">Next Level</div>
                    <strong>{this.state.predictedData[0]}</strong>
                  </li>
                  <li>
                    <div className="text-muted">Predicted Time Required</div>
                    <strong>{this.state.predictedData[2]} seconds</strong>
                  </li>
                  </ul>
                </CardFooter>
                <CardFooter>
                  <ul>
                  <li>
                    <div className="text-muted">Video Assignments</div>
                    <strong>{this.state.staticArr[0]['unwatchedVideo']}</strong>
                  </li>
                  </ul>
                </CardFooter>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <Card>
                <CardHeader className="cardheader">
                  <i className="fa fa-clone"></i> Percentile Ranking
                </CardHeader>
                <CardBody>
                  <div id="number">
                    <PercentileLinePlot />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col sm="6">
              <Card>
                <CardHeader className="cardheader">
                  <i className="fa fa-clone"></i> Weekly Progression
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
            <Col sm="12">
              <ReactTable data={this.state.flaggedArr}  
                columns={[
                  { Header: "Flagged Levels",
                  columns: [
                    {
                      Header: "Level Name",
                      accessor: "levelName",
                      maxWidth: 150
                    },
                    {
                      Header: "Level No.",
                      accessor: "levelNumber",
                      maxWidth: 70
                    },
                    {
                      Header: "Percentile",
                      accessor: "levelPercentile",
                      maxWidth: 100
                    },
                    {
                      Header: "Topic",
                      accessor: "levelTopic",
                      maxWidth: 330
                    },
                    {
                      Header: "Self-Enrichment Link",
                      accessor: "topicReadUp",
                      Cell: e => <a href={e.value}> {e.value}</a>
                    }]
                  }
                ]}
                defaultPageSize={5} className="-striped -highlight"
                />
            </Col>
          </Row>
          <br />

          <Row>
            <Col sm="12">
              <Card>
                <CardHeader className="cardheader">
                  <i className="fa fa-clone"></i> Time Performance
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
            <CardHeader className="cardheader">
              <i className="fa fa-clone"></i> Top Selected Tech Articles for the Week
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
                      <CardTitle>13 Noteworthy Points from Google’s JavaScript Style Guide</CardTitle>
                      <CardText>For anyone who isn’t already familiar with it, Google puts out a style guide for writing JavaScript that lays out (what Google believes to…</CardText>
                      <Button href="https://medium.freecodecamp.org/google-publishes-a-javascript-style-guide-here-are-some-key-lessons-1810b8ad050b?source=topic_page---8------0----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/javascript/js_image2.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Here are examples of everything new in ECMAScript 2016, 2017, and 2018</CardTitle>
                      <CardText>It’s hard to keep track of what’s new in JavaScript (ECMAScript). And it’s even harder to find useful code examples.</CardText>
                      <Button href="https://medium.freecodecamp.org/here-are-examples-of-everything-new-in-ecmascript-2016-2017-and-2018-d52fa3b5a70e?source=topic_page---8------1----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/javascript/js_image3.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Introducing the react-testing-library 🐐</CardTitle>
                      <CardText>A simpler replacement for enzyme that encourages good testing practices.</CardText>
                      <Button href="https://blog.kentcdodds.com/introducing-the-react-testing-library-e3a274307e65?source=topic_page---8------4----------------">Read Article</Button>
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
                      <CardTitle>The Mistakes I Made As a Beginner Programmer</CardTitle>
                      <CardText>Learn to identify them, make habits to avoid them.</CardText>
                      <Button href="https://medium.com/@samerbuna/the-mistakes-i-made-as-a-beginner-programmer-ac8b3e54c312?source=topic_page---8------2----------------">Read Article</Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                  <Card>
                    <CardImg src="../img/tech/tech_image3.jpg" alt="Card image cap" />
                    <CardBody style={{height: 245+"px"}}>
                      <CardTitle>Exploring ARCore: Digging fundamentals of AR</CardTitle>
                      <CardText>Augmented reality is picking up the heat nowadays. All the major companies such as Facebook, Apple, Microsoft, and Google are pushing their…</CardText>
                      <Button href="https://medium.com/@kevalpatel2106/exploring-arcore-digging-fundamentals-of-ar-9250ea10c8fd?source=topic_page---8------1----------------">Read Article</Button>
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
