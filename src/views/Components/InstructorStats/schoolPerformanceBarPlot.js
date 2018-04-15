import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, ColumnSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

class SchoolPerformanceBarPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schoolArr: [],
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/instructorInfo/schoolProgress').on('value', (snapshot) => {
        var schools = snapshot.val();
        var newStats = [];
        console.log(schools);
        for (var stat in schools) {
          newStats.push({
              schoolName: schools[stat]['schoolName'],
              timeSpent: schools[stat]['schoolTiming'],
              levelsCompleted: schools[stat]['schoolLevels']
          });
        }
        this.setState({
          schoolArr: newStats,
          mount: true
        });
    });
  }

  getSchools() {
    var schools = [];
    for (var sch = 0; sch < this.state.schoolArr.length; sch++ ) {
      schools.push(this.state.schoolArr[sch]['schoolName']);
    }
    return schools;
  }

  getSchoolTimingPerformance() {
    var timings = [];
    for (var sch = 0; sch < this.state.schoolArr.length; sch++ ) {
      timings.push(this.state.schoolArr[sch]['timeSpent']);
    }
    return timings;
  }

  getSchoolLevelPerformance() {
    var levels = [];
    for (var sch = 0; sch < this.state.schoolArr.length; sch++ ) {
      levels.push(parseInt(this.state.schoolArr[sch]['levelsCompleted']));
    }
    //console.log("here at levels")
    //console.log(levels);
    return levels;
  }

  render() {
    if (this.state.mount === true) {
    return(
      <div>
        <HighchartsChart>
          <Chart />
          <Title>Individual School Performance (Average)</Title>
          <Subtitle>Source: Achievements App</Subtitle>
          <XAxis categories={this.getSchools()}>
              <XAxis.Title>School</XAxis.Title>
          </XAxis>

          <YAxis id="number">
            <YAxis.Title>Count</YAxis.Title>
              <ColumnSeries id="performance" name="Time Spent (on average)" data={this.getSchoolTimingPerformance()} />
              <LineSeries name="Levels Completed (on average)" data={this.getSchoolLevelPerformance()} />
            <Tooltip />
          </YAxis>
        </HighchartsChart>
      </div>
    )} else {
      return null;
    }
  }
}

export default withHighcharts(SchoolPerformanceBarPlot, Highcharts); // Injecting the Highcharts object