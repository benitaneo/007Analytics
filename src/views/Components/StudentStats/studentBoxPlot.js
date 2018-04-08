import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, BoxPlotSeries, BoxPlot, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';
import addHighchartsMore from 'highcharts/highcharts-more';
addHighchartsMore(Highcharts);

import firebase from 'firebase';

class StudentBoxPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      performanceArr: [],
      levels: [],
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
          summary: [levels[stat]['minTiming'],levels[stat]['25thPercentile'],levels[stat]['medianTiming'],levels[stat]['75thPercentile'],levels[stat]['maxTiming']],
          personalTime: levels[stat]['personalTiming']
        });
      }
      var levelCount = [];
      for (var i = 1; i < newStats.length+1; i++) {
        levelCount.push(i);
      }
      this.setState({
        performanceArr: newStats,
        levels: levelCount,
        mount: true
      });
    });
  }

  getBoxPlotValues() {
    var data = [];
    for (var level = 0; level < this.state.performanceArr.length; level++) {
      data.push(this.state.performanceArr[level]['summary']);
    }
    console.log(data);
    return data;
  }

  getPersonalTiming() {
    var personal = [];
    for (var time = 0; time < this.state.performanceArr.length; time++) {
      personal.push(this.state.performanceArr[time]['personalTime']);
    }
    console.log(personal);
    return personal;
  }

  render() {
    if (this.state.mount === true) {
      return(
      <div>
        <HighchartsChart>
          <Chart />

          <Title>Performance over First 20 Levels</Title>

          <Subtitle>Source: Achievements App</Subtitle>

          <XAxis categories={this.state.levels}>
              <XAxis.Title>Level</XAxis.Title>
          </XAxis>

          <YAxis id="boxplot" min="0" max="1200" tickInterval="200" scrollbar="enabled">
            <YAxis.Title>Time Taken (seconds)</YAxis.Title>
            <BoxPlotSeries label="Time Taken" data={this.getBoxPlotValues()} />
            <LineSeries name="Personal Timing" data={this.getPersonalTiming()} />
            <Tooltip />
          </YAxis>
        </HighchartsChart>
      </div>
      )} else {
        return null;
      }
    }
  }

export default withHighcharts(StudentBoxPlot, Highcharts); // Injecting the Highcharts object