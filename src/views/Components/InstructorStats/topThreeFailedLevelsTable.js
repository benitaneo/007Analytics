import React, { Component } from 'react';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

import firebase from 'firebase';

class DifficultLevelsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mount: false,
      failedLevels: []
    };
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('instructorInfo/mostFailed').on('value', (snapshot) => {
      var failed = snapshot.val();
      var newStats = [];
      console.log(failed);
      for (var level in failed) {
        newStats.push({
          levelName: failed[level]['levelName'],
          failedCount: failed[level]['failedCount'],
          topic: failed[level]['topic']
        })
      }
      this.setState({
        failedLevels: newStats,
        mount: true
      });
    });
  }

  render() {
    if (this.state.mount === true) {
      return(
        <ReactTable data={this.state.failedLevels}  
          columns={[
            { Header: "Levels Students have difficulty understanding",
            columns: [
              {
                Header: "Level",
                accessor: "levelName"
              },
              {
                Header: "Failure Count",
                accessor: "failedCount"
              },
              {
                Header: "Topic",
                accessor: "topic"
              }]
            }
          ]}
          defaultPageSize={3} className="-striped -highlight"
          />
          );
  } else {
    return null;
    }
  }
}

export default DifficultLevelsTable;