export const action_types = {
    set_act_tree: 'set_act_tree',
}

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

export function setActTree(actTree){
    return {
        type: action_types.set_act_tree,
        act_tree: actTree,
    }
}