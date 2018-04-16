import React, {Component} from 'react';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

// Import React-Bootstrap-Table
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const headerstyle = { 
  backgroundColor: '#000000',
  color: 'orange',
  fontWeight: 'bold',
  textAlign: 'center'
}

import firebase from '../../firebase';

class StudentProgressDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levelsArr: [],
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/studentInfo/personalProgress').on('value', (snapshot) => {
      //console.log(snapshot.val());
      var levels = snapshot.val();
      var allLevels = [];
      for (var level in levels) {
        allLevels.push({
          levelName: level,
          time: levels[level]['timeTaken'],
          percentile: levels[level]['percentile']
        });
      }
      this.setState({
        levelsArr: allLevels,
        mount: true
      });
    });
  }

  render() {
    if (this.state.mount === true) {
      const options = {
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: this.state.levelsArr.length
        }],
        sizePerPage: 5,
        paginationSize: 3,
        prePage: 'Prev',
        nextPage: 'Next',
        firstPage: 'First',
        lastPage: 'Last',
        paginationPosition: 'top'
      }
      return (
        <div>
          <BootstrapTable data={this.state.levelsArr} 
          hover pagination search options={options} 
          exportCSV csvFileName='personal_progress.csv'>
            <TableHeaderColumn width="40%" thStyle={headerstyle} dataField='levelName' isKey={true}>Level Name</TableHeaderColumn>
            <TableHeaderColumn width="30%" thStyle={headerstyle} dataField='time' dataSort>Time Taken</TableHeaderColumn>
            <TableHeaderColumn width="30%" thStyle={headerstyle} dataField='percentile' dataSort>Percentile</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default StudentProgressDashboard;