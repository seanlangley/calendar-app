import { combineReducers } from 'redux';

const initialState = {
    isSignedIn: false,
    authToken: null,
    currActType: null,
    monthChartData: [],
    chartData: null,
}

function signIn(action) {
    return {
        isSignedIn: true,
        authToken: action.authToken
    };
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'signin':
            return Object.assign({}, state, signIn(action));
        case 'signout':
            return Object.assign({}, state, {
                isSignedIn: false
            });
        case 'set_act_type':
            return Object.assign({}, state, {
                currActType: action.new_act_type
            });
        case 'get_chart_data':
            return Object.assign({}, state, {
                chartData: action.data,
            });
        case 'set_chart_data':
            return Object.assign({}, state, {
                chartData: action.data,
            });
        default:
            return state;
    }
}

export default rootReducer;