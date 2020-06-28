export const mapStateToProps = (state, ownProps) => {
    return {
        isSignedIn: state.isSignedIn,
        authToken: state.authToken,
        currActType: state.currActType,
        monthChartData: state.monthChartData,
        loading: state.loading,
        chartData: state.chartData,
    };
};