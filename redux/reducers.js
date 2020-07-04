import { combineReducers } from 'redux';

const initialState = {
    isSignedIn: false,
    authToken: null,
    currActType: null,
    monthChartData: [],
    chartData: {
        hasData: false,
        data: {}
    },
    actTypes: [],
    currTypeIdx: -1,
}

function signIn(action) {
    return {
        isSignedIn: true,
        authToken: action.authToken
    };
}

function chartData(state = initialState.chartData, action) {
    switch (action.type) {
        case 'receive_chart_data':
            return Object.assign({}, state, {
                data: action.data,
                hasData: true,
            });
        case 'invalidate_chart_data':
            return Object.assign({}, state, {
                data: {},
                hasData: false
            })
    }
}

function manageActs(state = initialState.actTypes, action) {
    switch (action.type) {
        case 'add_act_type':
            return [...state, {
                name: action.name,
                acts: [],
            }];
        case 'add_act':
            var curr_act_info;
            state.forEach(type_info => {
                if (type_info.name == action.name){
                    curr_act_info = type_info;
                }
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
        case 'add_act_type':
            return Object.assign({}, state, {
                actTypes: manageActs(state.actTypes, action)
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