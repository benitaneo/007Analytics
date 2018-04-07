import React, {Component} from 'react';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap';
import firebase from '../../firebase'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

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
            <ReactTable data={this.state.instructorsArr} filterable  
              columns={[
                {
                  Header: "School",
                  accessor: "instructorSchool",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["instructorName"] }),
                  filterAll: true
                },
                {
                  Header: "Instructor Name",
                  accessor: "instructorName",
                  maxWidth: 150,
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value) &&
                    row[filter.id].endsWith(filter.value)
                },
                {
                  Header: "Cohort",
                  accessor: "cohort",
                  maxWidth: 100
                },
                {
                  Header: "Instructor Contact No.",
                  accessor: "instructorContact",
                  maxWidth: 150
                },
                {
                  Header: "Instructor Email",
                  accessor: "instructorEmail"
                }
              ]}
              defaultPageSize={10} className="-striped -highlight"
            />
          </div>
      )
    } else {
      return null;
    }
  }
}

export default InstructorContacts;
