import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, BoxPlotSeries } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

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
        return(
        <div>
          <HighchartsChart>
            <Chart />

            <Title>Performance over Past 20 Levels</Title>

            <Subtitle>Source: App</Subtitle>

            <XAxis>
                <XAxis.Title>Level</XAxis.Title>
            </XAxis>

            <YAxis id="number">
              <YAxis.Title>Percentile</YAxis.Title>
              <BoxPlotSeries id="1" name="L1" data={[this.state.performanceArr[0]['minTiming'],this.state.performanceArr[0]['25thPercentile'],this.state.performanceArr[0]['medianTiming'],this.state.performanceArr[0]['75thPercentile'],this.state.performanceArr[0]['maxTiming']]} />
            </YAxis>
          </HighchartsChart>
        </div>
        )} else {
          return null;
        }
      }
    }

export default withHighcharts(StudentBoxPlot, Highcharts); // Injecting the Highcharts object