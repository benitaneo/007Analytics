import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, ColumnSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

class StudentPerformanceBarPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentsArr: [],
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/instructorInfo/studentProgress').on('value', (snapshot) => {
        var students = snapshot.val();
        var newStats = [];
        for (var stat in students) {
          newStats.push({
              studentName: students[stat]['studentName'],
              studentLevel: students[stat]['studentLevel'],
              studentGameID: students[stat]['studentGameID']
          });
        }
        this.setState({
          studentsArr: newStats,
          mount: true
        });
    });
  }

  getStudentNames() {
    var students = [];
    for (var student = 0; student < this.state.studentsArr.length; student++ ) {
      students.push(this.state.studentsArr[student]['studentName']);
    }
    return students;
  }

  getStudentLevels() {
    var levels = [];
    for (var student = 0; student < this.state.studentsArr.length; student++ ) {
      levels.push(this.state.studentsArr[student]['studentLevel']);
    }
    return levels;
  }

  render() {
    if (this.state.mount === true) {
    return(
      <div>
        <HighchartsChart>
          <Chart />
          <Title>Individual Student Performance (Average)</Title>
          <Subtitle>Source: Achievements App</Subtitle>
          <XAxis categories={this.getStudentNames()}>
              <XAxis.Title>Student</XAxis.Title>
          </XAxis>

          <YAxis id="levels">
              <YAxis.Title>Number of Levels</YAxis.Title>
              <ColumnSeries id="performance" name="Levels Completed" data={
                  this.getStudentLevels()                    
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

export default withHighcharts(StudentPerformanceBarPlot, Highcharts); // Injecting the Highcharts object