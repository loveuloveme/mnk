import actions from '../actions/';
import { createStore } from 'redux';

let initialState = {
    workbook: null,
    list: '',
    x: {},
    y: {}  
};

function reducer(state, action) {
    switch(action.type) {
        case actions.SET_WORKBOOK: return {...state, workbook: action.workbook};
        case actions.SET_LIST: return {...state, list: action.list};
        case actions.SET_X: return {...state, x: action.value};
        case actions.SET_Y: return {...state, y: action.value};
        default: return state;
    }
}

const store = createStore(reducer, initialState);

export default store;