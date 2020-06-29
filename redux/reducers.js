import { combineReducers } from 'redux';

const initialState = {
    isSignedIn: false,
    authToken: null,
    currActType: null,
    monthChartData: [],
    chartData: {
        hasData: false,
        data: {}
    }
}

function signIn(action) {
    return {
        isSignedIn: true,
        authToken: action.authToken
    };
}

function chartData(state = initialState.chartData, action){
    switch (action.type) {
        case 'receive_chart_data':
            return Object.assign({}, state, {
                data: action.data,
                hasData: true,
            });
    }
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
        case 'receive_chart_data':
            return Object.assign({}, state, {
                chartData: chartData(state.chartData, action)
            });
        default:
            return state;
    }
}

export default rootReducer;