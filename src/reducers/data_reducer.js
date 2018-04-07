import ActionTypes from '../constants/action_types';
//import firebase from 'firebase';

// change according to your firebase project
const config = {
  apiKey: "AIzaSyDqg0j1TJPVwjEZQgTgz92vzzsrvkLgmFw",
  authDomain: "dashboard-235a6.firebaseapp.com",
  databaseURL: "https://dashboard-235a6.firebaseio.com",
  projectId: "dashboard-235a6",
  storageBucket: "dashboard-235a6.appspot.com",
  messagingSenderId: "82982572137"
};

//firebase.initializeApp(config);
//var db = firebase.database();

const initialState = {
  adminData:{},
  fetchAdminDataStatus: "NIL",
  instructorData:{},
  fetchInstructorDataStatus: "NIL",
  studentData:{},
  fetchStudentDataStatus: "NIL",
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FetchAdminData:
    	return {
    		...state,
    		fetchAdminDataStatus: "FETCHING",
    	}

    case ActionTypes.FetchAdminDataSuccess:
      return {
        ...state,
        adminData: action.payload,
        fetchAdminDataStatus: "FETCHED"
      }

    case ActionTypes.FetchAdminDataError:
      return {
        ...state,
        fetchAdminDataStatus: "ERROR"
      }

    case ActionTypes.FetchInstructorData:
      return {
        ...state,
        fetchInstructorDataStatus: "FETCHING",
      }

    case ActionTypes.FetchInstructorDataSuccess:
      return {
        ...state,
        instructorData: action.payload,
        fetchInstructorDataStatus: "FETCHED"
      }

    case ActionTypes.FetchInstructorDataError:
      return {
        ...state,
        fetchInstructorDataStatus: "ERROR"
      }

    case ActionTypes.FetchStudentData:
      return {
        ...state,
        fetchStudentDataStatus: "FETCHING",
      }

    case ActionTypes.FetchStudentDataSuccess:
      return {
        ...state,
        studentData: action.payload,
        fetchStudentDataStatus: "FETCHED"
      }

    case ActionTypes.FetchStudentDataError:
      return {
        ...state,
        fetchStudentDataStatus: "ERROR"
      }
    default:
      return state
  }
}

export const initializeFirebase = () => {
  return dispatch => {
    dispatch({
      type: ActionTypes.FetchAdminData
    });
    dispatch({
      type: ActionTypes.FetchInstructorData
    });
    dispatch({
      type: ActionTypes.FetchStudentData
    });

    db.ref("/adminInfo").on("value", data => {
      if (data.val()) {
        dispatch({
          type: ActionTypes.FetchAdminDataSuccess, 
          payload: data.val()
        });
      } else {
        dispatch({
          type: ActionTypes.FetchAdminDataError
        })
      }
    });

    db.ref("/instructorInfo").on("value", data => {
      if (data.val()) {
        dispatch({
          type: ActionTypes.FetchInstructorDataSuccess, 
          payload: data.val()
        });
      } else {
        dispatch({
          type: ActionTypes.FetchInstructorDataError
        })
      }
    });

    db.ref("/studentInfo").on("value", data => {
      if (data.val()) {
        dispatch({
          type: ActionTypes.FetchStudentDataSuccess, 
          payload: data.val()
        });
      } else {
        dispatch({
          type: ActionTypes.FetchStudentDataError
        })
      }
    });
  }
}