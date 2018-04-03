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

// material-ui components
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// highcharts
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

// import wanted components
import SchoolPerformanceBarPlot from '../Components/InstructorStats/schoolPerformanceBarPlot';
import StudentPerformanceBarPlot from '../Components/InstructorStats/studentPerformanceBarPlot';
import YoutubeLinePlot1 from '../Components/InstructorStats/youtubeVideoStats1'
import YoutubeLinePlot2 from '../Components/InstructorStats/youtubeVideoStats2'
import YoutubeLinePlot3 from '../Components/InstructorStats/youtubeVideoStats3'
import YoutubeLinePlot4 from '../Components/InstructorStats/youtubeVideoStats4'
import YoutubeLinePlot5 from '../Components/InstructorStats/youtubeVideoStats5'
import firebase from '../../firebase';
import { MuiThemeProvider } from 'material-ui/styles';

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
      mount: false,
      value: 1,
      performanceArr: [],
      test: []
    };
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    const db = firebase.database();
    if (this.state.value === 1) {
      db.ref('/instructorInfo/videoPause/-L8Gz-q54aVyOc3icUgO').on('value', (snapshot) => {
          var intervals = snapshot.val();
          var newStats = [];
          console.log(intervals);
          for (var stat in intervals) {
          newStats.push({
              interval: intervals[stat]['videoInterval'],
              pauseCount: intervals[stat]['pauseCount']
          });
          }
          this.setState({
          performanceArr: newStats,
          mount: true,
          day: getDaysLeft()
          });
      });
      db.ref('/instructorInfo/schoolPerformance').on('value', (snapshot) => {
        var test = snapshot.val();
        console.log("got here");
        console.log(test);
      })
    }
  }

  getIntervals() {
    var intervals = []
    for (var i = 0; i < this.state.performanceArr.length; i++) {
        intervals.push(this.state.performanceArr[i]['interval']);
    }
    return intervals;
  }

  getPauseCounts() {
    var counts = []
    for (var i = 0; i < this.state.performanceArr.length; i++) {
        counts.push(this.state.performanceArr[i]['pauseCount']);
    }
    return counts;
  }

  handleSelection(value) {
    console.log("got here");
    console.log(value);
    const db = firebase.database();
    var videos = {'1': '-L7gr-AXrwUuurOxT1Pe', '2':'-L7r10yH58UkhyiwxS7t', '3': '-L8PEzVB0fRyhmQAOBx1', '4': '-L8Gz-q54aVyOc3icUgO', '5': '-L8H-0i0w2y8TTccE6T2', '6': '-L8H-we7JsrUikMrESh5', '7':'-L8H0WhmBwqjY3FHlkv8'}
    console.log(videos[value]);
    db.ref('/instructorInfo/videoPause/'+videos[value]).on('value', (snapshot) => {
        var intervals = snapshot.val();
        var newStats = [];
        //console.log(intervals);
        for (var stat in intervals) {
        newStats.push({
            interval: intervals[stat]['videoInterval'],
            pauseCount: intervals[stat]['pauseCount']
        });
        }
        this.setState({
        performanceArr: newStats,
        mount: true,
        day: getDaysLeft()
        });
    });
  }

  handleChange(event, index, value) {
    this.setState({value: value});
    this.handleSelection(value);
  } 

  render() {
    if (this.state.mount === true) {
      return (
        <MuiThemeProvider>
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
          <Col sm="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Youtube Analytics
              </CardHeader>
              <CardBody>
                <SelectField
                floatingLabelText="Choose a Video"
                value={this.state.value}
                onChange={this.handleChange}
                >
                  <MenuItem value={1} primaryText="Introduction to AWS Lambda Video" />
                  <MenuItem value={2} primaryText="Real Time Charts Tutorial" />
                  <MenuItem value={3} primaryText="AWS Lambda Lab 1" />
                  <MenuItem value={4} primaryText="AWS Lambda Lab 2" />
                  <MenuItem value={5} primaryText="AWS Lambda Lab 3" />
                  <MenuItem value={6} primaryText="AWS Lambda Lab 4" />
                  <MenuItem value={7} primaryText="AWS Lambda Lab 5" />
                </SelectField>

                <HighchartsChart>
                  <Chart />
                  <Title>Number of pauses at every 10 seconds interval</Title>
                  <Subtitle>Source: Achievements App</Subtitle>
                  <XAxis name="Time Interval" categories={this.getIntervals()}>
                      <XAxis.Title>Time Interval</XAxis.Title>
                  </XAxis>

                  <YAxis id="youtube1">
                      <YAxis.Title>Counts</YAxis.Title>
                      <LineSeries id="performance" name="Counts" data={
                          this.getPauseCounts()                    
                          } />
                  </YAxis>
                  <Tooltip />
              </HighchartsChart>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </div>
        </MuiThemeProvider>
      )
    } else {
      return null;
    }
  }
}

export default withHighcharts(InstructorDashboard, Highcharts);
