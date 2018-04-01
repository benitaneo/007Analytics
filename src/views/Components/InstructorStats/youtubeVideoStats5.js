import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

class YoutubeLinePlot5 extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        performanceArr: [],
        mount: false
      };
    }

    componentDidMount() {
      const db = firebase.database()
      db.ref('/instructorInfo/videoPause/-L8PEzVB0fRyhmQAOBx1').on('value', (snapshot) => {
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
          mount: true
          });
      });
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
      
    render() {
        if (this.state.mount === true) {
        return(
        <div>
            <HighchartsChart>
                <Chart />
                <Title>Number of pauses at every 10 seconds interval</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis name="Time Interval" categories={this.getIntervals()}>
                    <XAxis.Title>Time Interval</XAxis.Title>
                </XAxis>

                <YAxis id="youtube5">
                    <YAxis.Title>Counts</YAxis.Title>
                    <LineSeries id="performance" name="Counts" data={
                        this.getPauseCounts()                    
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

export default withHighcharts(YoutubeLinePlot5, Highcharts); // Injecting the Highcharts object