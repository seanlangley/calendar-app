import { check_fetch } from '../utils/utils';

export function signIn(token) {
    return {
        type: 'signin',
        authToken: token,
    };
}
export function signOut() {
    return { type: 'signout' };
}

export function setActType(new_type) {
    return {
        type: 'set_act_type',
        new_act_type: new_type
    }
}

export function postAct(post_info){
    var return_val = {
        day: post_info.day,
        name: post_info.name
    };
    if (post_info.action == 'delete'){
        return_val.type = 'delete_act';
    }
    else {
        return_val.type = 'update_act';
        return_val.was_done = post_info.action == 'was_done' ? true : false;
    }
    return return_val;
}

export function addActType(name){
    return {
        type: 'add_act_type',
        name: name,
    }
}

export function invalidateChartData(){
    return {
        type: 'invalidate_chart_data'
    }
}

export function setChartData(data) {
    return {
        type: 'receive_chart_data',
        data: data,
    }
}

function initialize_data(act_types_list) {
    var chart_data = {};
    act_types_list.forEach(type_data => {
        chart_data[type_data.name] = {};
        var month_entry = [];
        var week_entry = [];
        var month_data = type_data['month_table'];
        var week_data = type_data['week_table'];
        month_data.forEach((month, idx) => {
            month_entry.push({ 'month': idx, 'ratio': month['Ratio'] });
        });
        week_data.forEach((weekday, idx) => {
            week_entry.push({ 'weekday': idx, 'ratio': weekday['Ratio'] });
        });
        chart_data[type_data.name]['month'] = month_entry;
        chart_data[type_data.name]['week'] = week_entry;
    });
    return chart_data;
}

export function fetchChartData(token) {
    return function (dispatch) {
        return fetch('http://localhost:8000/analyze_activities', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Token ' + token
            }
        })
            .then(response => response.json())
            .then(json => dispatch(setChartData(initialize_data(json))));
        }
}
