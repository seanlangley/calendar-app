export const mapStateToProps = (state, ownProps) => {
    return {
        isSignedIn: state.isSignedIn,
        authToken: state.authToken,
        currActType: state.currActType,
        loading: state.loading,
        actTypes: state.actTypes,
    };
};