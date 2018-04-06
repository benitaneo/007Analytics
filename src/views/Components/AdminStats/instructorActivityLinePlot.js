import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip, ColumnSeries} from 'react-jsx-highcharts';
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

class InstructorActivityLinePlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        allInstructors: [],
        allPostings: [],
        allWeeks: [],
        mount: false
      };
    }

    componentDidMount() {
        const db = firebase.database();
        db.ref('/adminInfo/instructorActivity').on('value', (snapshot) => {
            var instructors = snapshot.val();
            console.log(instructors);
            var getinstructors = [];
            var int = [];
            for (var key in instructors) {
                getinstructors.push(key);
                var individual = [];
                var weeks = [];
                for (var wk in instructors[key]) {
                    weeks.push(wk);
                    individual.push(instructors[key][wk]);
                }
                int.push(individual);
            }
            this.setState({
                allInstructors: getinstructors,
                allPostings: int,
                allWeeks: weeks,
                mount: true
            });
            //console.log(this.state.allPostings);
            //console.log(this.state.allWeeks);
        });
    }
    
    getWeeks() {
        var weeks = []
        for (var wk = 0; wk < this.state.allWeeks.length; wk++) {
            weeks.push(this.state.allWeeks[wk]);
        }
        return weeks;
    }
    getAmandaPostings() {
        var postings = []
        for (var i = 0; i < this.state.allPostings[0].length; i++) {
            postings.push(this.state.allPostings[0][i]['postingCount']);
        }
        //console.log(postings)
        return postings;
    }
    getAnirudhPostings() {
        var postings = []
        for (var i = 0; i < this.state.allPostings[1].length; i++) {
            postings.push(this.state.allPostings[1][i]['postingCount']);
        }
        //console.log(postings)
        return postings;
    }
    getProfPostings() {
        var postings = []
        for (var i = 0; i < this.state.allPostings[2].length; i++) {
            postings.push(this.state.allPostings[2][i]['postingCount']);
        }
        //console.log(postings)
        return postings;
    }
    getSandraPostings() {
        var postings = []
        for (var i = 0; i < this.state.allPostings[3].length; i++) {
            postings.push(this.state.allPostings[3][i]['postingCount']);
        }
        //console.log(postings)
        return postings;
    }
    getDeveloperPostings() {
        var postings = []
        for (var i = 0; i < this.state.allPostings[4].length; i++) {
            postings.push(this.state.allPostings[4][i]['postingCount']);
        }
        //console.log(postings)
        return postings;
    }
         
    render() {
        if (this.state.mount === true) {
        return(
        <MuiThemeProvider>
        <div>
            <HighchartsChart plotOptions={plotOptions}>
                <Chart />
                <Title>Weekly Assignments Posting Rate</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis name="Week" categories={this.getWeeks()}>
                    <XAxis.Title>Week</XAxis.Title>
                </XAxis>

                <YAxis id="postings">
                    <YAxis.Title>Number of Assignment Postings</YAxis.Title>
                    <LineSeries name="Amanda Crew" data={this.getAmandaPostings()} />
                    <LineSeries name="Anirudh" data={this.getAnirudhPostings()} />
                    <LineSeries name="developer up" data={this.getDeveloperPostings()} />
                    <LineSeries name="Prof Boesch" data={this.getProfPostings()} />
                    <LineSeries name="Sandra Boesch" data={this.getSandraPostings()} />
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

export default withHighcharts(InstructorActivityLinePlot, Highcharts); // Injecting the Highcharts object