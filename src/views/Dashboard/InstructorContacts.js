import React, {Component} from 'react';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap';
import firebase from '../../firebase'

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

class InstructorContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instructorsArr: [],
      mount: false
    };
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref('/adminInfo/schoolsInstructor').on('value', (snapshot) => {
      var instructors = snapshot.val();
      var allInstructors = [];
      console.log(instructors);
      for (var cohort in instructors) {
        for (var instructor in instructors[cohort]) {
          if (cohort === "2018 National Coding Championships - Junior") {
            allInstructors.push({
              instructorName: instructors[cohort][instructor]['instructorName'],
              instructorSchool: instructors[cohort][instructor]['school'],
              instructorEmail: instructors[cohort][instructor]['email'],
              instructorContact: instructors[cohort][instructor]['contactNumber'],
              cohort: "Junior"
            });
          } else if (cohort === "2018 National Coding Championships - Primary") {
            allInstructors.push({
              instructorName: instructors[cohort][instructor]['instructorName'],
              instructorSchool: instructors[cohort][instructor]['school'],
              instructorEmail: instructors[cohort][instructor]['email'],
              instructorContact: instructors[cohort][instructor]['contactNumber'],
              cohort: "Primary"
            });
          } else if (cohort === "2018 National Coding Championships - Senior") {
            allInstructors.push({
              instructorName: instructors[cohort][instructor]['instructorName'],
              instructorSchool: instructors[cohort][instructor]['school'],
              instructorEmail: instructors[cohort][instructor]['email'],
              instructorContact: instructors[cohort][instructor]['contactNumber'],
              cohort: "Senior"
            });
          }
        }
      }
      this.setState({
        instructorsArr: allInstructors,
        mount: true
      });
    });
  }

  render() {
    if (this.state.mount === true) {
      return (
        <div>
          <BootstrapTable data={this.state.instructorsArr} hover pagination search exportCSV csvFileName='schoolContacts.csv'>
            <TableHeaderColumn width="30%" thStyle={headerstyle} isKey dataField='instructorSchool' dataSort>School</TableHeaderColumn>
            <TableHeaderColumn width="20%" thStyle={headerstyle} dataField='instructorName'>Instructor Name</TableHeaderColumn>
            <TableHeaderColumn width="10%" thStyle={headerstyle} dataField='cohort' dataSort>Cohort</TableHeaderColumn>
            <TableHeaderColumn width="20%" thStyle={headerstyle} dataField='instructorContact'>Instructor Contact No.</TableHeaderColumn>
            <TableHeaderColumn width="20%" thStyle={headerstyle} dataField='instructorEmail'>Instructor Email</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default InstructorContacts;
