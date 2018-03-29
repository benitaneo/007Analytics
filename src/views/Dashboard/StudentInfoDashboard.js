import React, {Component} from 'react';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

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
    db.ref('/instructorInfo').on('value', (snapshot) => {
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
        });
      }
      this.setState({
        studentsArr: allStudents,
        mount: true
      });
    });
  }

  render() {
    console.log("here");
    console.log(this.state.studentsArr);
    if (this.state.mount === true) {
      console.log("got here");
      console.log(this.state.studentsArr);
      return (
          <div>
              <ReactTable data={this.state.studentsArr} filterable defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value} 
                columns={[
                  {
                    Header: "Name",
                    accessor: "name",
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: ["name"] }),
                    filterAll: true
                  },
                  {
                    Header: "ID",
                    accessor: "id",
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value) &&
                      row[filter.id].endsWith(filter.value)
                  },
                  {
                    Header: "Number of Completed Levels",
                    accessor: "id"
                  },
                  {
                    Header: "Last Completed Date",
                    accessor: "id"
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

export default StudentInfoDashboard;