import React, {Component} from 'react';
import {Bar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import {CardColumns, Card, CardHeader, CardBody} from 'reactstrap';
import * as firebase from 'firebase';

const myCharts = {
  line1 :{
    chartType: true,
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Custom Line Chart',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [60, 59, 80, 81, 56, 55, 40]
        //data: some_data
      }
    ]
  },
  
  bar1: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Custom bar chart',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  }


};

const line = {
  chartType: true,
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [60, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const bar = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const doughnut = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
};

const radar = {
  labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(179,181,198,0.2)',
      borderColor: 'rgba(179,181,198,1)',
      pointBackgroundColor: 'rgba(179,181,198,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      data: [65, 59, 90, 81, 56, 55, 40]
    },
    {
      label: 'My Second dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      pointBackgroundColor: 'rgba(255,99,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: [28, 48, 40, 19, 96, 27, 100]
    }
  ]
};

const pie = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
};

const polar = {
  datasets: [{
    data: [
      11,
      16,
      7,
      3,
      14
    ],
    backgroundColor: [
      '#FF6384',
      '#4BC0C0',
      '#FFCE56',
      '#E7E9ED',
      '#36A2EB'
    ],
    label: 'My dataset' // for legend
  }],
  labels: [
    'Red',
    'Green',
    'Yellow',
    'Grey',
    'Blue'
  ]
};


const MyChart = (props) => (
  <Card> 
  <CardHeader>
    {props.chart.title}
    <div className="card-actions">
      <a href="http://www.chartjs.org">
        <small className="text-muted">docs</small>
      </a>
    </div>
  </CardHeader>
  <CardBody>
    <div className="chart-wrapper">
    {props.chart.chartType === "Line" &&
      <Line data={props.chart.data}/>
    }
    {props.chart.chartType === "Bar" &&
      <Bar data={props.chart.data}/>
    }
    {props.chart.chartType === "Doughnut" &&
      <Doughnut data={props.chart.data}/>
    }
    {props.chart.chartType === "Radar" &&
      <Radar data={props.chart.data}/>
    }
    {props.chart.chartType === "Pie" &&
      <Pie data={props.chart.data}/>
    }
    {props.chart.chartType === "Polar" &&
      <Polar data={props.chart.data}/>
    }
    </div>
  </CardBody>
</Card>
)

class Charts extends Component {

  //Get the passed in list of charts. 
  //Add Card components in a loop. 
  //Then add the remaining elements.
  constructor(props) {
    super(props);
    //Change this to be an object to iterate.
    this.state = {isLoggedIn: false};
    // var local_data = {};
    // let db = firebase.database().ref('/');    
    // db.off();
    // db.on('value', snapshot => {
    //   /* Update React state when message is added at Firebase Database */
    //   console.log('inside mount from charts');
    //   local_data = snapshot.val();
    //   //this.setState(locData);
    //   // props.local_data = locData;
      
      
    //   //this.state = locData;
    // })
    
    console.log("In Charts.js ->",props.local_data.greeting);
    //Change this to be an object to iterate.
    //Then put data in locally rather than from variables. 
    //Then move to local_data and get from props. 
    this.inPageChartsArray = [{"title":"In Page Line Chart 1","chartType":"Line","data":line},
                 {"title":"In Page Line Chart 2","chartType":"Line","data":line},
                 {"title":"In Page Bar Chart 3", "chartType":"Bar","data":bar},
                 {"title":"In Page Doughnut Chart 4", "chartType":"Doughnut", "data":doughnut},
                 {"title":"In Page Radar Chart 5", "chartType":"Radar","data":radar},
                 {"title":"In Page Pie Chart 6", "chartType":"Pie", "data":pie},
                 {"title":"In Page Polar Chart 7", "chartType":"Polar", "data":polar}
                ];
    
    //Convert this.data2 to a list of object similar to this.data. 
    this.localDataChartsArray = Object.keys(props.local_data.charts).map(function(key) {
       var item = props.local_data.charts[key];
       return item;
    });           
    
    this.firebaseChartsArray = [];
    /*
    this.firebaseChartsArray = Object.keys(props.firebase.charts).map(function(key) {
      var item = props.firebase.charts[key];
      return item;
   });  
   */         
   
    
  }
  render() {
    return (
      <div className="animated fadeIn">
        <CardColumns className="cols-2">

        {this.firebaseChartsArray.map(function(chart, index){
          // Adding each chart from passed in data. 
            return <MyChart key={index} chart={chart} />;
        })}

        {this.localDataChartsArray.map(function(chart, index){
          // Adding each chart from passed in data. 
            return <MyChart key={index} chart={chart} />;
        })}

        {this.inPageChartsArray.map(function(chart, index){
          // Adding each chart from passed in data. 
            return <MyChart key={index} chart={chart} />;
        })}
          <Card>
            <CardHeader>
              Line Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={line}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              Bar Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Bar data={bar}
                />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Doughnut Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Doughnut data={doughnut}/>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Radar Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Radar data={radar}/>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Pie Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Pie data={pie}/>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Polar Area Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Polar data={polar}/>
              </div>
            </CardBody>
          </Card>
        </CardColumns>
      </div>
    )
  }
}

export default Charts;
