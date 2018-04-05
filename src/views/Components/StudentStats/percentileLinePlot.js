import React, {Component} from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

import firebase from 'firebase';

class PercentileLinePlot extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        performanceArr: [],
        mount: false
      };
    }

    componentDidMount() {
        const db = firebase.database()
        db.ref('/studentInfo/pastPerformance').on('value', (snapshot) => {
            var levels = snapshot.val();
            var newStats = [];
            console.log(levels);
            newStats.push({
                level: 0,
                timeTaken: 0
            })
            for (var stat in levels) {
            newStats.push({
                level: stat,
                timeTaken: levels[stat]['timeTaken']
            });
            }
            this.setState({
            performanceArr: newStats,
            mount: true
            });
        });
    }

    getTimings() {
        var wanted = []
        for (var level = 0; level < this.state.performanceArr.length; level++) {
            wanted.push(this.state.performanceArr[level]['timeTaken']);
        }
        console.log(wanted);
        return wanted;
    }
      
    render() {
        if (this.state.mount === true) {
        return(
        <div>
            <HighchartsChart>
                <Chart />
                <Title>Percentile (Time Taken per level)</Title>
                <Subtitle>Source: Achievements App</Subtitle>
                <XAxis>
                    <XAxis.Title>Level</XAxis.Title>
                </XAxis>

                <YAxis id="number">
                    <YAxis.Title>Percentile</YAxis.Title>
                    <LineSeries id="performance" name="Percentile" data={
                        this.getTimings()                    
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

export default withHighcharts(PercentileLinePlot, Highcharts); // Injecting the Highcharts object