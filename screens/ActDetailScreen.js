import React from 'react';
import { Text, View } from 'react-native';
import { ActChart } from '../components/actChart';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs'

function ActDetailScreen(props) {
    var act_data = props.monthChartData[0];
    return (
        <View>
            <ActChart name={act_data.name} data={act_data.data}/>
        </View>
    );
}
export default redux.connect(mapStateToProps, null)(ActDetailScreen);