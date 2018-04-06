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

class SignUpJuniorLinePlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        allSchools: [],
        recordedWeeks: [],
        recordedSignups: [],
        mount: false,
        value: ""
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSelection = this.handleSelection.bind(this);
    }

    componentDidMount() {
        const db = firebase.database();
        db.ref('/adminInfo/signUpRate/2018 National Coding Championships - Junior').on('value', (snapshot) => {
            var juniorSch = snapshot.val();
            //console.log(juniorSch);
            var juniorSchs = [];
            for (var sch in juniorSch) {
                juniorSchs.push(sch);
            }
            this.setState({
                allSchools: juniorSchs,
                mount: true
            });
        });
    }

    handleSelection(value) {
        console.log("got to selection!");
        const db = firebase.database();
        console.log(value);
        db.ref('/adminInfo/signUpRate/2018 National Coding Championships - Junior/'+value).on('value', (snapshot) => {
            var weeks = snapshot.val();
            //console.log(weeks);
            var allWeeks = [];
            var allCounts = [];
            for (var wk in weeks) {
                allWeeks.push(weeks[wk]['week']);
                allCounts.push(weeks[wk]['signups']);
            }
            this.setState({
                recordedWeeks: allWeeks,
                recordedSignups: allCounts
            });
        }); 
    }

    handleChange(event, index, value) {
        this.handleSelection(value);
    }
    
    getWeeks() {
        var weeks = []
        for (var wk = 0; wk < this.state.recordedWeeks.length; wk++) {
            weeks.push(this.state.recordedWeeks[wk]);
        }
        return weeks;
    }

    getSignUpCount() {
        var counts = []
        for (var i = 0; i < this.state.recordedSignups.length; i++) {
            counts.push(this.state.recordedSignups[i]);
        }
        return counts;
    }
      
    render() {
        if (this.state.mount === true) {
        return(
        <MuiThemeProvider>
        <div>
            <SelectField
                floatingLabelText="Choose a School"
                fullWidth={true}
                value={this.state.key}
                onChange={this.handleChange}
                style={{overflow: 'hidden'}}
                >
                    {this.state.allSchools.map((name, index) => (
                        <MenuItem key={index} value={name} primaryText={name} />
                    ))}
            </SelectField>
            <HighchartsChart plotOptions={plotOptions}>
                <Chart />
                <Title>Weekly Sign-up Rate</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis name="Week" categories={this.getWeeks()}>
                    <XAxis.Title>Week</XAxis.Title>
                </XAxis>

                <YAxis id="signin">
                    <YAxis.Title>Number of Sign-ups</YAxis.Title>
                    <LineSeries name="No. Sign-ups" data={
                        this.getSignUpCount()                  
                        } />
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

export default withHighcharts(SignUpJuniorLinePlot, Highcharts); // Injecting the Highcharts object