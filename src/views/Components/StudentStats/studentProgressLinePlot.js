import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

class StudentProgressLinePlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        performanceArr: [],
        mount: false
      };
    }

    componentDidMount() {
        const db = firebase.database()
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
            performanceArr: newStats,
            mount: true
            });
        });
    }

    getWeeks() {
        var wanted = [];
        for (var wk = 0; wk < this.state.performanceArr.length; wk++) {
            wanted.push(this.state.performanceArr[wk]['week']);
        }
        return wanted;
    }

    getPersonal() {
        var personal = [];
        for (var wk = 0; wk < this.state.performanceArr.length; wk++) {
            personal.push(this.state.performanceArr[wk]['personalCompleted']);
        }
        return personal;
    }

    getCohort() {
        var cohort = [];
        for (var wk = 0; wk < this.state.performanceArr.length; wk++) {
            cohort.push(this.state.performanceArr[wk]['cohortCompleted']);
        }
        return cohort;
    }
      
    render() {
        if (this.state.mount === true) {
        return(
        <div>
            <HighchartsChart>
                <Chart />
                <Title>Number of Levels Completed over Weeks</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis categories={this.getWeeks()}>
                    <XAxis.Title>Week</XAxis.Title>
                </XAxis>
                
                <Legend layout="vertical" align="center" />

                <YAxis id="completed">
                    <YAxis.Title>Number of Levels</YAxis.Title>
                    <LineSeries name="Levels Completed (you)" data={
                        this.getPersonal()                    
                        } />
                    <LineSeries name="Levels Completed (cohort on average)" data={
                        this.getCohort()                    
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

export default withHighcharts(StudentProgressLinePlot, Highcharts); // Injecting the Highcharts object