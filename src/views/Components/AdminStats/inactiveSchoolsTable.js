import React, { Component } from 'react';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';

import firebase from 'firebase';

class InactiveSchoolsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: 0,
      mount: false,
      flaggedSchools: []
    };
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('adminInfo/inactiveSchools').on('value', (snapshot) => {
      var flagged = snapshot.val();
      var newStats = [];
      console.log(flagged);
      for (var cohort in flagged) {
        if (cohort === "2018 National Coding Championships - Primary") {
          for (var sch in flagged[cohort]) {
            newStats.push({
              name: flagged[cohort][sch]['school'],
              cohort: "Primary"
            });
          }
        } else if (cohort === "2018 National Coding Championships - Junior") {
          for (var sch in flagged[cohort]) {
            newStats.push({
              name: flagged[cohort][sch]['school'],
              cohort: "Junior"
            });
          }
        } else if (cohort === "2018 National Coding Championships - Senior") {
          for (var sch in flagged[cohort]) {
            newStats.push({
              name: flagged[cohort][sch]['school'],
              cohort: "Senior"
            });
          }
        }
      }
      this.setState({
        flaggedSchools: newStats,
        mount: true
      });
    });
    console.log(this.state.flaggedSchools);
  }


  render() {
    if (this.state.mount === true) {
      return(
        <ReactTable data={this.state.flaggedSchools}  
          columns={[
            { Header: "Inactive Schools",
            columns: [
              {
                Header: "School",
                accessor: "name"
              },
              {
                Header: "Cohort Category",
                accessor: "cohort"
              }]
            }
          ]}
          defaultPageSize={5} className="-striped -highlight"
          />
          );
  } else {
    return null;
    }
  }
}

export default InactiveSchoolsTable;