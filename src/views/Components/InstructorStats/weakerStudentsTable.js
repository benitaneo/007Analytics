import React, { Component } from 'react';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

import firebase from 'firebase';

class WeakerStudentsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mount: false,
      weakStudents: []
    };
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('instructorInfo/weakerStudents').on('value', (snapshot) => {
      var weak = snapshot.val();
      var newStats = [];
      //console.log(weak);
      for (var student in weak) {
        var failedlevels = [];
        for (var topic in weak[student]['failedLevels']){
          failedlevels.push(weak[student]['failedLevels'][topic][1]);
        }
        newStats.push({
          studentName: weak[student]['studentName'],
          failedCount: weak[student]['failedCount'],
          topic: failedlevels
        })
      }
      this.setState({
        weakStudents: newStats,
        mount: true
      });
    });
  }

  render() {
    if (this.state.mount === true) {
      return(
        <ReactTable data={this.state.weakStudents}  
          columns={[
            { Header: "Students scoring < 25th Percentile",
            columns: [
              {
                Header: "Student Name",
                accessor: "studentName",
                maxWidth: 120
              },
              {
                Header: "Failure Count",
                accessor: "failedCount",
                maxWidth: 100
              },
              {
                Header: "Topic",
                accessor: "topic"
              }]
            }
          ]}
          defaultPageSize={10} className="-striped -highlight"
          />
          );
  } else {
    return null;
    }
  }
}

export default WeakerStudentsTable;