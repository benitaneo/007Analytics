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
  CardImg,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
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

// wanted components
import Sidebar from '../../components/Sidebar/';

const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

// Card Chart 1
const cardChartData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40]
    }
  ],
};

const cardChartOpts1 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'transparent',
        zeroLineColor: 'transparent'
      },
      ticks: {
        fontSize: 2,
        fontColor: 'transparent',
      }

    }],
    yAxes: [{
      display: false,
      ticks: {
        display: false,
        min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
      }
    }],
  },
  elements: {
    line: {
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 2
const cardChartData2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11]
    }
  ],
};

const cardChartOpts2 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'transparent',
        zeroLineColor: 'transparent'
      },
      ticks: {
        fontSize: 2,
        fontColor: 'transparent',
      }

    }],
    yAxes: [{
      display: false,
      ticks: {
        display: false,
        min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
      }
    }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 3
const cardChartData3 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40]
    }
  ],
};

const cardChartOpts3 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false
    }],
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 4
const cardChartData4 = {
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
    }
  ],
};

const cardChartOpts4 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false,
      barPercentage: 0.6,
    }],
    yAxes: [{
      display: false,
    }]
  }
}

// Main Chart

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
  labels: ["Anglo-Chinese", "Wellington", "Others"],
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
  fill: false,
  min: 0,
  borderColor: 'rgb(255, 99, 132)',
  data: [20, 40, 30, 2, 20, 30, 45],
  }]
}


const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        },
        ticks: {
          beginAtZero: true,
          min: 0
        }
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
};

const participationChart = {
  datasets: [
    {
      label: 'Participation Rate',
      backgroundColor: convertHex(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: participationData,
      options: options
    }
  ]
}

const mainChart = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: convertHex(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    },
    {
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2
    },
    {
      label: 'My Third dataset',
      backgroundColor: 'transparent',
      borderColor: brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5],
      data: data3
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

const mainChartOpts = {
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
        stepSize: Math.ceil(250 / 5),
        max: 250
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


class StudentDashboard extends Component {
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

          <Col xs="12" sm="6" lg="4">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Primary Category
              </CardHeader>
              <CardBody>
                <Table>
                  <table className="responsive table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>School Name</th>
                        <th>No. of Participants</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Anglo-Chinese Primary</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Wellington Primary</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>All Others</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="4">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Junior Category
              </CardHeader>
              <CardBody>
                <Table>
                  <table className="responsive table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>School Name</th>
                        <th>No. of Participants</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Anglo-Chinese Primary</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Wellington Primary</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>All Others</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="4">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Senior Category
              </CardHeader>
              <CardBody>
                <Table>
                  <table className="responsive table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>School Name</th>
                        <th>No. of Participants</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Anglo-Chinese Primary</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Wellington Primary</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>All Others</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
        <Col xs="12" md="6" className="mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  <i className="icon-calculator"></i> <span className={ this.state.activeTab === '1' ? "" : "d-none"}> Calculator</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  <i className="icon-basket-loaded"></i> <span
                  className={ this.state.activeTab === '2' ? "" : "d-none"}> Shopping cart</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                >
                  <i className="icon-pie-chart"></i> <span className={ this.state.activeTab === '3' ? "" : "d-none"}> Charts</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="2">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="3">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
              </TabPane>
            </TabContent>
          </Col>
        </Row>

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
                <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                  <Line data={mainChart} options={mainChartOpts} height={300}/>
                </div>
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
        
        <Row>
          <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Top Selected Tech Articles for the Week
          </CardHeader>
            <CardBody>
            <Row>
              <Col xs="12" sm="6" lg="4">
                <h2>JavaScript</h2>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" lg="4">
                <Card>
                  <CardImg src="../img/javascript/js_image1.jpg" alt="Card image cap" />
                  <CardBody style={{height: 245+"px"}}>
                    <CardTitle>🎼webpack 4: released today!!✨</CardTitle>
                    <CardText>Codename: Legato 🎶</CardText>
                    <Button href="https://medium.com/webpack/webpack-4-released-today-6cdb994702d4?source=topic_page---8------0----------------">Read Article</Button>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="4">
                <Card>
                  <CardImg src="../img/javascript/js_image2.jpg" alt="Card image cap" />
                  <CardBody style={{height: 245+"px"}}>
                    <CardTitle>Elegant patterns in modern JavaScript: RORO</CardTitle>
                    <CardText>I wrote my first few lines of JavaScript not long after the language was invented. If you told me at the time that I would one day be …</CardText>
                    <Button href="https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd?source=topic_page---8------1----------------">Read Article</Button>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="4">
                <Card>
                  <CardImg src="../img/javascript/js_image3.jpg" alt="Card image cap" />
                  <CardBody style={{height: 245+"px"}}>
                    <CardTitle>Straightforward code splitting with React and webpack</CardTitle>
                    <CardText>Everything seemed perfect until your app size increased too fast …</CardText>
                    <Button href="https://medium.freecodecamp.org/straightforward-code-splitting-with-react-and-webpack-4b94c28f6c3f?source=topic_page---8------0----------------">Read Article</Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs="12" sm="6" lg="4">
                <h2>Latest Technology</h2>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" lg="4">
                <Card>
                  <CardImg src="../img/tech/tech_image1.jpg" alt="Card image cap" />
                  <CardBody style={{height: 245+"px"}}>
                    <CardTitle>It’s Time to Leave San Francisco</CardTitle>
                    <CardText>That’s it. The Kevin Roose article in the New York Times did it for you. It’s time to leave San Francisco. It’s time to leave Silicon…</CardText>
                    <Button href="https://thebolditalic.com/its-time-to-leave-san-francisco-2a5a74f42433?source=topic_page---8------0----------------">Read Article</Button>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="4">
                <Card>
                  <CardImg src="../img/tech/tech_image2.jpg" alt="Card image cap" />
                  <CardBody style={{height: 245+"px"}}>
                    <CardTitle>Enacting the nation’s strongest net neutrality protections in California</CardTitle>
                    <CardText>An open internet is essential to maintaining our democracy, growing our economy, protecting consumers, and preserving critical health…</CardText>
                    <Button href="https://medium.com/@Scott_Wiener/enacting-the-nations-strongest-net-neutrality-protections-in-california-bdee6bb9b3c1?source=topic_page---8------1----------------">Read Article</Button>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="4">
                <Card>
                  <CardImg src="../img/tech/tech_image3.jpg" alt="Card image cap" />
                  <CardBody style={{height: 245+"px"}}>
                    <CardTitle>Can Bots Help Us Deal with Grief?</CardTitle>
                    <CardText>How simulations can bring our loved ones back to life</CardText>
                    <Button href="https://medium.com/s/when-robots-rule-the-world/can-bots-help-us-deal-with-grief-3de488cae96?source=topic_page---8------3----------------">Read Article</Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            </CardBody>
          </Card>
        </Row>
      </div>
    )
  }
}

export default StudentDashboard;
