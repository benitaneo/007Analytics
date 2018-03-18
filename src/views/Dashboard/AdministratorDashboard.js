import React, { Component } from 'react';
import classnames from 'classnames';
import {Bar, Line} from 'react-chartjs-2';
import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Nav,
  NavItem,
  NavLink,
  Input,
  Table,
  TabContent,
  TabPane
} from 'reactstrap';

const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

// convert Hex to RGBA
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

var participationData = {
  labels: ["Anglo-Chinese Primary School", "Wellington Primary School", "Other Primary School"],
  datasets: [{
  label: "Primary Participation Rate",
  backgroundColor: 'rgb(255, 99, 132)',
  borderColor: 'rgb(255, 99, 132)',
  data: [20, 40, 30],
  }]
}

var activeData = {
  labels: ["Week 1", "Week 2", "Week 3"],
  datasets: [{
  label: "Primary Category Activity Rate",
  backgroundColor: 'rgb(255, 99, 132)',
  borderColor: 'rgb(255, 99, 132)',
  data: [20, 40, 30, 2, 20, 30, 45],
  }]
}

const participationChart = {
  datasets: [
    {
      label: 'Participation Rate',
      backgroundColor: convertHex(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: participationData
    }
  ]
}

const participationChartOpts = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        drawOnChartArea: false,
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5,
        stepSize: Math.ceil(100 / 5),
        max: 100
      }
    }]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    }
  }
}


class AdministratorDashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }


  render() {

    return (
      <div className="animated fadeIn">

        <Row>
          <Col lg="6">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Participation Rate</CardTitle>
                    <div className="small text-muted">March 2018</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">
                        <Label htmlFor="option1" className="btn btn-outline-secondary active">
                          <Input type="radio" name="options" id="option1" defaultChecked/> Primary
                        </Label>
                        <Label htmlFor="option2" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option2"/> Junior
                        </Label>
                        <Label htmlFor="option3" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option3"/> Senior
                        </Label>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <Bar data={participationData} width={100} height={50} />
              </CardBody>
            </Card>
          </Col>

          <Col lg="6">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Activity Rate</CardTitle>
                    <div className="small text-muted">March 2018</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">
                        <Label htmlFor="option1" className="btn btn-outline-secondary active">
                          <Input type="radio" name="options" id="option1" defaultChecked/> Primary
                        </Label>
                        <Label htmlFor="option2" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option2"/> Junior
                        </Label>
                        <Label htmlFor="option3" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option3"/> Senior
                        </Label>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <Line data={activeData} width={100} height={50} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Traffic</CardTitle>
                    <div className="small text-muted">November 2015</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">
                        <Label htmlFor="option1" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option1"/> Day
                        </Label>
                        <Label htmlFor="option2" className="btn btn-outline-secondary active">
                          <Input type="radio" name="options" id="option2" defaultChecked/> Month
                        </Label>
                        <Label htmlFor="option3" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option3"/> Year
                        </Label>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>

              </CardBody>
              <CardFooter>
                <ul>
                  <li>
                    <div className="text-muted">Visits</div>
                    <strong>29.703 Users (40%)</strong>
                    <Progress className="progress-xs mt-2" color="success" value="40"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Unique</div>
                    <strong>24.093 Users (20%)</strong>
                    <Progress className="progress-xs mt-2" color="info" value="20"/>
                  </li>
                  <li>
                    <div className="text-muted">Pageviews</div>
                    <strong>78.706 Views (60%)</strong>
                    <Progress className="progress-xs mt-2" color="warning" value="60"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">New Users</div>
                    <strong>22.123 Users (80%)</strong>
                    <Progress className="progress-xs mt-2" color="danger" value="80"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Bounce Rate</div>
                    <strong>Average 40.15%</strong>
                    <Progress className="progress-xs mt-2" color="primary" value="40"/>
                  </li>
                </ul>
              </CardFooter>
            </Card>
          </Col>
        </Row>

      </div>
    )
  }
}

export default AdministratorDashboard;
