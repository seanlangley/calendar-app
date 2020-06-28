
export function signIn(token) {
    return {
        type: 'signin',
        authToken: token,
    };
}
export function signOut() {
    return { type: 'signout'};
}

export function setActType(new_type){
    return {
        type: 'set_act_type',
        new_act_type: new_type
    }
}