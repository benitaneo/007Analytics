import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, ColumnSeries, Tooltip } from 'react-jsx-highcharts';
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
    db.ref('/instructorInfo/schoolPerformance').on('value', (snapshot) => {
        var schools = snapshot.val();
        var newStats = [];
        console.log(schools);
        for (var stat in schools) {
          newStats.push({
              schoolName: schools[stat]['schoolName'],
              timeSpent: schools[stat]['schoolAverageTime']
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

  getSchoolPerformance() {
    var schools = [];
    for (var sch = 0; sch < this.state.schoolArr.length; sch++ ) {
      schools.push(this.state.schoolArr[sch]['timeSpent']);
    }
    return schools;
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
              <YAxis.Title>Time Spent per Student (Mins)</YAxis.Title>
              <ColumnSeries id="performance" name="Time Spent" data={
                  this.getSchoolPerformance()                    
                  } />
          </YAxis>
          <Tooltip />
        </HighchartsChart>
      </div>
    )} else {
      return null;
    }
  }
}

export default withHighcharts(SchoolPerformanceBarPlot, Highcharts); // Injecting the Highcharts object