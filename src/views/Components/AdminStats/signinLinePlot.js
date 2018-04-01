import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

const plotOptions = {
    series: {
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b> ({point.y:,.0f})',
        softConnector: true
      },
      center: ['30%', '40%'],
      neckWidth: '30%',
      neckHeight: '25%',
      width: '50%'
    }
};

class SignInLinePlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        signInArr: [],
        mount: false
      };
    }

    componentDidMount() {
        const db = firebase.database()
        db.ref('/adminInfo/signInRate').on('value', (snapshot) => {
            var weeks = snapshot.val();
            var newStats = [];
            console.log(weeks);
            for (var stat in weeks) {
            newStats.push({
                week: weeks[stat]['Week'],
                signinCount: weeks[stat]['SignInCount']
            });
            }
            this.setState({
            signInArr: newStats,
            mount: true
            });
        });
    }

    getWeeks() {
        var weeks = []
        for (var wk = 0; wk < this.state.signInArr.length; wk++) {
            weeks.push(this.state.signInArr[wk]['week']);
        }
        return weeks;
    }

    getSignInCount() {
        var counts = []
        for (var i = 0; i < this.state.signInArr.length; i++) {
            counts.push(this.state.signInArr[i]['signinCount']);
        }
        return counts;
    }
      
    render() {
        if (this.state.mount === true) {
        return(
        <div>
            <HighchartsChart plotOptions={plotOptions}>
                <Chart />
                <Title>Weekly Sign-in Rate</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis categories={this.getWeeks()}>
                    <XAxis.Title>Week</XAxis.Title>
                </XAxis>

                <YAxis id="signin">
                    <YAxis.Title>Number of Sign-ins</YAxis.Title>
                    <LineSeries id="performance" name="Time Taken" data={
                        this.getSignInCount()                    
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

export default withHighcharts(SignInLinePlot, Highcharts); // Injecting the Highcharts object