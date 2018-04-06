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

class StudentDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: 0,
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
                <CardBody style={{backgroundColor: '#ffa07a'}}>
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
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Percentile Ranking
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
            <Col sm="12">
              <ReactTable data={this.state.flaggedArr}  
                columns={[
                  { Header: "Flagged Levels",
                  columns: [
                    {
                      Header: "Level Name",
                      accessor: "levelName",
                      maxWidth: 200
                    },
                    {
                      Header: "Level Number",
                      accessor: "levelNumber",
                      maxWidth: 100
                    },
                    {
                      Header: "Percentile",
                      accessor: "levelPercentile",
                      maxWidth: 100
                    },
                    {
                      Header: "Topic",
                      accessor: "levelTopic"
                    },
                    {
                      Header: "Self-Enrichment Link",
                      accessor: "topicReadUp"
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
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Time Performance
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
