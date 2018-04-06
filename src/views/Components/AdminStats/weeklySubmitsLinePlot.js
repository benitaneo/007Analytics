import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

// material-ui components
import { MuiThemeProvider } from 'material-ui/styles';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

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

class WeeklySubmitsLinePlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        allWeeks: [],
        primarySubmissions: [],
        juniorSubmissions: [],
        seniorSubmissions: [],
        mount: false
      };
    }

    componentDidMount() {
        const db = firebase.database();
        db.ref('/adminInfo/weeklySubmits/2018 National Coding Championships - Primary').on('value', (snapshot) => {
            var priSubmits = snapshot.val();
            console.log(priSubmits);
            var primarySubmission = [];
            for (var wk in priSubmits) {
                primarySubmission.push(priSubmits[wk]['submissionsCount']);
            }
            this.setState({
                primarySubmissions: primarySubmission
            });
        });
        db.ref('/adminInfo/weeklySubmits/2018 National Coding Championships - Junior').on('value', (snapshot) => {
            var juniorSubmits = snapshot.val();
            console.log(juniorSubmits);
            var juniorSubmission = [];
            for (var wk in juniorSubmits) {
                juniorSubmission.push(juniorSubmits[wk]['submissionsCount']);
            }
            this.setState({
                juniorSubmissions: juniorSubmission
            });
        });
        db.ref('/adminInfo/weeklySubmits/2018 National Coding Championships - Senior').on('value', (snapshot) => {
            var seniorSubmits = snapshot.val();
            console.log(seniorSubmits);
            var seniorSubmission = [];
            var weeks = []
            for (var wk in seniorSubmits) {
                seniorSubmission.push(seniorSubmits[wk]['submissionsCount']);
                weeks.push(wk);
            }
            this.setState({
                seniorSubmissions: seniorSubmission,
                allWeeks: weeks,
                mount: true
            });
        });
    }
    
    getWeeks() {
        var weeks = []
        for (var wk = 0; wk < this.state.allWeeks.length; wk++) {
            weeks.push(this.state.allWeeks[wk]);
        }
        console.log(weeks)
        return weeks;
    }

    getPrimarySubmissionsCount() {
        var counts = []
        for (var i = 0; i < this.state.primarySubmissions.length; i++) {
            counts.push(this.state.primarySubmissions[i]);
        }
        console.log(counts)
        return counts;
    }
    
    getJuniorSubmissionsCount() {
        var counts = []
        for (var i = 0; i < this.state.juniorSubmissions.length; i++) {
            counts.push(this.state.juniorSubmissions[i]);
        }
        console.log(counts)
        return counts;
    }
    
    getSeniorSubmissionsCount() {
        var counts = []
        for (var i = 0; i < this.state.seniorSubmissions.length; i++) {
            counts.push(this.state.seniorSubmissions[i]);
        }
        console.log(counts)
        return counts;
    }
      
    render() {
        if (this.state.mount === true) {
        return(
        <MuiThemeProvider>
        <div>
            <HighchartsChart plotOptions={plotOptions}>
                <Chart />
                <Title>Weekly Submissions Rate</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis name="Week" categories={this.getWeeks()}>
                    <XAxis.Title>Week</XAxis.Title>
                </XAxis>

                <YAxis id="submissions">
                    <YAxis.Title>Number of Submissions</YAxis.Title>
                    <LineSeries name="Primary Submissions" data={this.getPrimarySubmissionsCount()} />
                    <LineSeries name="Junior Submissions" data={this.getJuniorSubmissionsCount()} />
                    <LineSeries name="Senior Submissions" data={this.getSeniorSubmissionsCount()} />
                </YAxis>
                <Tooltip />
            </HighchartsChart>
        </div>
        </MuiThemeProvider>
        )} else {
            return null;
        }
    }
}

export default withHighcharts(WeeklySubmitsLinePlot, Highcharts); // Injecting the Highcharts object