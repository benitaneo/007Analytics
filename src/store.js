import { createStore } from 'redux';

const reducer = (state = {}, action) => {
  switch(action.type) {
  case 'SET_VAL':
    return {
      ...state,
      val: action.payload
      };
                    
// Handle other actions here
default:
return state;
  }
};

const store = createStore(reducer);
export default store;