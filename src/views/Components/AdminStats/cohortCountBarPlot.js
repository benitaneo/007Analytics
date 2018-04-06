import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, ColumnSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

// material-ui components
import { MuiThemeProvider } from 'material-ui/styles';
import {Tabs, Tab} from 'material-ui/Tabs';

import firebase from 'firebase';

class CohortCountBarPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schoolsArr: [],
      juniorArr: [],
      seniorArr: [],
      value: "Senior",
      mount: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('/adminInfo/studentsPerSchool/2018 National Coding Championships - Senior').on('value', (snapshot) => {
      var senior = snapshot.val();
      var newStats = [];
      console.log(senior);
      for (var sch in senior) {
        newStats.push({
            schoolName: senior[sch]['schoolName'],
            studentCount: senior[sch]['studentCount']
        });
      }
      this.setState({
        schoolsArr: newStats,
        mount: true
      });
    });
  }
     
  handleToggle(value) {
    const db = firebase.database();
    db.ref('/adminInfo/studentsPerSchool/2018 National Coding Championships - '+value).on('value', (snapshot) => {
      var school = snapshot.val();
      var newStats = [];
      console.log(school);
      for (var sch in school) {
        newStats.push({
            schoolName: school[sch]['schoolName'],
            studentCount: school[sch]['studentCount']
        });
      }
      this.setState({
        schoolsArr: newStats,
        value: value
      });
    });
  }

  handleChange(event, index, value) {
    console.log(event);
    this.handleToggle(event);
  }

  getSchools() {
    var schools = [];
    for (var sch = 0; sch < this.state.schoolsArr.length; sch++ ) {
      schools.push(this.state.schoolsArr[sch]['schoolName']);
    }
    return schools;
  }

  getSchoolsCount() {
    var count = [];
    for (var sch = 0; sch < this.state.schoolsArr.length; sch++ ) {
      count.push(this.state.schoolsArr[sch]['studentCount']);
    }
    return count;
  }

  render() {
    if (this.state.mount === true) {
    return(
      <MuiThemeProvider>
      <div>
        <Tabs onChange={this.handleChange} value={this.state.value}>
          <Tab label="Senior" value="Senior" />
          <Tab label="Junior" value="Junior" />
          <Tab label="Primary" value="Primary" />
        </Tabs>
        <HighchartsChart>
          <Chart />
          <Title>Individual School Count</Title>
          <Subtitle>Source: Achievements App</Subtitle>
          <XAxis categories={this.getSchools()}>
              <XAxis.Title>School</XAxis.Title>
          </XAxis>

          <YAxis id="number">
            <YAxis.Title>Count</YAxis.Title>
              <ColumnSeries id="performance" name="Number of students" data={this.getSchoolsCount()} />
            <Tooltip />
          </YAxis>
        </HighchartsChart>
      </div>
      </MuiThemeProvider>
    )} else {
      return null;
    }
  }
}

export default withHighcharts(CohortCountBarPlot, Highcharts); // Injecting the Highcharts object