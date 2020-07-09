import {action_types} from './actions';

const initialState = {
    currActType: null,
    actTypes: {},
};

interface activity {
    'was_done': boolean
}

interface activity_dict {
    [index: string]: activity
}

interface act_type_dict {
    [index: string]: act_type;
}

interface act_type {
    'name': string;
    'acts': activity_dict
    'units'?: string
}


function signIn(action) {
    return {
        isSignedIn: true,
        authToken: action.authToken
    };
}

interface manage_act_list_action {
    type: string;
    day: string;
    was_done: boolean;
}
function manageActList(state = {}, action: manage_act_list_action){
    switch(action.type){
        case 'update_act':
            let new_act: activity_dict = {};
            new_act[action.day] = {was_done: action.was_done};
            return Object.assign({}, state, new_act);
        case 'delete_act':
            let act_copy: activity_dict = Object.assign({}, state);
            delete act_copy[action.day];
            return act_copy;
    }
}

interface manage_act_types_action {
    type: string;
    name?: string;
    old_name?: string;
    new_name?: string;
    units?: string;
}

function manageActs(state = initialState.actTypes, action: manage_act_types_action) {
    switch (action.type) {
        case 'add_act_type':
            var new_act_info = {}
            new_act_info[action.name] = {
                name: action.name,
                acts: {}
            };
            return Object.assign({}, state, new_act_info);
        case action_types.edit_act_type:
            if (action.new_name.length == 0){
                action.new_name = action.old_name;
            }
            var new_act_types: act_type_dict = Object.assign({}, state);
            var old_acts: activity_dict = Object.assign({}, state[action.old_name].acts);
            delete new_act_types[action.old_name];
            var edited_act_type: act_type = {
                'name': action.new_name,
                'units': action.units,
                'acts': old_acts,
            }
            new_act_types[action.new_name] = edited_act_type;
            return new_act_types;
        case action_types.delete_act_type:
            var act_name = action.name;
            
            return;
        case 'update_act':
        case 'delete_act':
            var acts_of_type = {};
            acts_of_type[action.name] = Object.assign({}, state[action.name]);
            acts_of_type[action.name].acts = manageActList(state[action.name].acts, action);
            return Object.assign({}, state, acts_of_type);
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
        case action_types.edit_act_type:
        case action_types.delete_act_type:
            return Object.assign({}, state, {
                actTypes: manageActs(state.actTypes, action)
            });
        case action_types.set_act_tree:
            return Object.assign({}, state, {
                actTypes: action.act_tree
            })
        default:
            return state;
    }
}

export default rootReducer;