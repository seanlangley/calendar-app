
export function signIn(token) {
    return {
        type: 'signin',
        token: token,
    };
}
export function signOut() {
    return { type: 'signout'};
}