import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, BoxPlotSeries, BoxPlot } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';
import addHighchartsMore from 'highcharts/highcharts-more';
addHighchartsMore(Highcharts);

import firebase from 'firebase';

class StudentBoxPlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        performanceArr: [],
        mount: false
      };
    }

    componentDidMount() {
        const db = firebase.database()
        db.ref('/studentInfo/levelTimings').on('value', (snapshot) => {
          //console.log(snapshot.val());
          var levels = snapshot.val();
          var newStats = [];
          console.log(levels);
          for (var stat in levels) {
            newStats.push({
              level: stat,
              twentyfifth: levels[stat]['25thPercentile'],
              seventyfifth: levels[stat]['75thPercentile'],
              maxTime: levels[stat]['maxTiming'],
              minTime: levels[stat]['minTiming'],
              medianTime: levels[stat]['medianTiming'],
              personalTime: levels[stat]['personalTiming']
            });
          }
          this.setState({
            performanceArr: newStats,
            mount: true
          });
        });
      }

    render() {
      if (this.state.mount === true) {
        console.log(this.state.performanceArr);
        console.log(this.state.performanceArr[0]);
        console.log(this.state.performanceArr[0]['minTime']);
        console.log(this.state.performanceArr[0]['twentyfifth']);
        console.log(this.state.performanceArr[0]['medianTime']);
        return(
        <div>
          <HighchartsChart>
            <Chart />

            <Title>Performance over Past 20 Levels</Title>

            <Subtitle>Source: App</Subtitle>

            <XAxis categories={[1,2,3,4,5]}>
                <XAxis.Title>Level</XAxis.Title>
            </XAxis>

            <YAxis id="boxplot">
              <YAxis.Title>Percentile</YAxis.Title>
              <BoxPlotSeries data={[this.state.performanceArr[0]['minTime'],this.state.performanceArr[0]['twentyfifth'],this.state.performanceArr[0]['medianTiming'],this.state.performanceArr[0]['seventyfifth'],this.state.performanceArr[0]['maxTime']]} />
              <BoxPlotSeries data={[this.state.performanceArr[1]['minTime'],this.state.performanceArr[1]['twentyfifth'],this.state.performanceArr[1]['medianTiming'],this.state.performanceArr[1]['seventyfifth'],this.state.performanceArr[1]['maxTime']]} />
            </YAxis>
          </HighchartsChart>
        </div>
        )} else {
          return null;
        }
      }
    }

export default withHighcharts(StudentBoxPlot, Highcharts); // Injecting the Highcharts object