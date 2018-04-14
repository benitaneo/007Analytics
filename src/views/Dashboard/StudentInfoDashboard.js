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

class StudentInfoDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentsArr: [],
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/instructorInfo/studentTable').on('value', (snapshot) => {
      //console.log(snapshot.val());
      var students = snapshot.val();
      var allStudents = [];
      console.log(students);
      for (var student in students) {
        allStudents.push({
          studentNo: student,
          id: students[student].studentID,
          name: students[student].studentName,
          photo: students[student].studentPhotoLink,
          school: students[student].studentSchool,
          completed: students[student].studentCompleted,
          active: students[student].studentLastActive
        });
      }
      this.setState({
        studentsArr: allStudents,
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
          text: 'All', value: this.state.studentsArr.length
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
          <BootstrapTable data={this.state.studentsArr} 
          hover pagination search options={options} 
          exportCSV csvFileName='studentContacts.csv'>
            <TableHeaderColumn width="20%" thStyle={headerstyle} isKey dataField='name' dataSort>Student Name</TableHeaderColumn>
            <TableHeaderColumn width="40%" thStyle={headerstyle} dataField='id'>Achievements App ID</TableHeaderColumn>
            <TableHeaderColumn width="20%" thStyle={headerstyle} dataField='completed' dataSort>No. of Completed Levels</TableHeaderColumn>
            <TableHeaderColumn width="20%" thStyle={headerstyle} dataField='active' dataSort>Last Active Date</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default StudentInfoDashboard;