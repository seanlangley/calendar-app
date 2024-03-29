export const action_types = {
    set_act_tree: 'set_act_tree',
    edit_act_type: 'edit_act_type',
    delete_act_type: 'delete_act_type',
    set_should_save: 'set_should_save',
}

export function signIn(token: any) {
    return {
        type: 'signin',
        authToken: token,
    };
}
export function signOut() {
    return { type: 'signout' };
}

export function setActType(new_type: string) {
    return {
        type: 'set_act_type',
        new_act_type: new_type
    }
}

interface post_info {
    day: string;
    action: string;
    name: string;
    number_done: string;
}
export function postAct(post_info: post_info){
    interface return_val {
        day: string,
        name: string,
        type?: string,
        was_done?: boolean,
        number_done: number,
    }
    var return_val: return_val = {
        day: post_info.day,
        name: post_info.name,
        number_done: parseInt(post_info.number_done)
    };
    if (post_info.action == 'delete'){
        return_val.type = 'delete_act';
    }
    else {
        return_val.type = 'update_act';
        if (post_info.action == 'was_done'){
            return_val.was_done = true;
        }
        else{
            return_val.was_done = false;
            return_val.number_done = 0;
        }
    }
    return return_val;
}

export function addActType(name: string){
    return {
        type: 'add_act_type',
        name: name,
    }
}

export function editActType(new_name: string, old_name: string, units: string){
    interface returnval {
        old_name: string;
        new_name: string;
        units: string;
        type: string;
    }
    var returnval: returnval = {
        old_name: old_name,
        new_name: new_name,
        units: units,
        type: action_types.edit_act_type
    }
    return returnval;
}

export function setActTree(actTree: object){
    return {
        type: action_types.set_act_tree,
        act_tree: actTree,
    }
}

export function deleteActType(name: string){
    return {
        type: action_types.delete_act_type,
        name: name
    }
}

export function setShouldSave(value: boolean){
    return {
        type: action_types.set_should_save,
        value: value,
    }
}