import { connect } from 'react-redux';
import { getData } from '../../actions/get_data';
import InstructorFull from '../Full/instructor_Full';

function mapStateToProps(state) {
  return {
    data: state.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onGetData: () => dispatch(getData()),
  };
}

const DataContainer = connect(mapStateToProps, mapDispatchToProps)(InstructorFull);

export default DataContainer;