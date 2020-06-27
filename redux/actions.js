
export function signIn(token) {
    return {
        type: 'signin',
        authToken: token,
    };
}
export function signOut() {
    return { type: 'signout'};
}