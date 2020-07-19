import {action_types} from './actions';

export interface activity_t {
    'was_done': boolean;
    'number_done': number;
}

export interface activity_dict_t {
    [isoday: string]: activity_t
}

export interface act_type_dict_t {
    [name: string]: act_type_t;
}

export interface act_type_t {
    'name': string;
    'acts': activity_dict_t;
    'units': string;
}

export interface root_state_t {
    currActType: string;
    actTypes: act_type_dict_t;
}

const initialState: root_state_t = {
    currActType: "",
    actTypes: {},
};


function signIn(action: any) {
    return {
        isSignedIn: true,
        authToken: action.authToken
    };
}

interface manage_act_list_action {
    type: string;
    day: string;
    was_done: boolean;
    number_done: number;
}
function manageActList(state: activity_dict_t = {}, action: manage_act_list_action): activity_dict_t{
    switch(action.type){
        case 'update_act':
            let new_act: activity_dict_t = {};
            new_act[action.day] = {
                was_done: action.was_done,
                number_done: action.number_done
            };
            return Object.assign({}, state, new_act);
        case 'delete_act':
            let act_copy: activity_dict_t = Object.assign({}, state);
            delete act_copy[action.day];
            return act_copy;
        default:
            return state
    }
}

interface manage_act_types_action {
    type: string;
    name: string;
    old_name: string;
    new_name: string;
    units: string;
}

function manageActTypes(state: act_type_dict_t = initialState.actTypes,
                    action: manage_act_types_action): act_type_dict_t {
    switch (action.type) {
        case 'add_act_type':
            var new_act_info: act_type_dict_t = {}
            new_act_info[action.name] = {
                name: action.name,
                acts: {},
                units: "",
            };
            return Object.assign({}, state, new_act_info);
        case action_types.edit_act_type:
            if (action.new_name.length == 0){
                action.new_name = action.old_name;
            }
            if (action.units.length == 0 && state[action.old_name].units == undefined) {
                action.units = "";
            }
            else {
                action.units = state[action.old_name].units;
            }
            var new_act_types: act_type_dict_t = Object.assign({}, state);
            var old_acts: activity_dict_t = Object.assign({}, state[action.old_name].acts);
            delete new_act_types[action.old_name];
            var edited_act_type: act_type_t = {
                'name': action.new_name,
                'units': action.units,
                'acts': old_acts,
            }
            new_act_types[action.new_name] = edited_act_type;
            return new_act_types;
        case action_types.delete_act_type:
            var curr_tree: act_type_dict_t = Object.assign({}, state);
            delete curr_tree[action.name];
            return curr_tree;
        case 'update_act':
        case 'delete_act':
            var acts_of_type: act_type_dict_t = {};
            acts_of_type[action.name] = Object.assign({}, state[action.name]);
            acts_of_type[action.name].acts = manageActList(state[action.name].acts, action);
            return Object.assign({}, state, acts_of_type);
        default:
            return state;
    }
}

function rootReducer(state: root_state_t = initialState, action: any) {
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
                actTypes: manageActTypes(state.actTypes, action)
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