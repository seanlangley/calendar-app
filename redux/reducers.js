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
    actTypes: {},
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

function manageActList(state = {}, action){
    switch(action.type){
        case 'update_act':
            let new_act = {};
            new_act[action.day] = {was_done: true};
            return Object.assign({}, state, new_act);
    }
}

function manageActs(state = initialState.actTypes, action) {
    switch (action.type) {
        case 'add_act_type':
            var new_act_info = {}
            new_act_info[action.name] = {
                name: action.name,
                acts: {}
            };
            return Object.assign({}, state, new_act_info);
        case 'update_act':
            var acts_of_type = {};
            acts_of_type[action.name] = Object.assign({}, state[action.name]);
            acts_of_type[action.name].acts = manageActList(state[action.name].acts, action);
            return Object.assign({}, state, acts_of_type);
        case 'delete_act':
            return;
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
        case 'update_act':
        case 'delete_act':
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