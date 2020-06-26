import React from 'react';
import { Text, View } from 'react-native';
import { ActChart } from '../components/actChart';

export default function ActDetailScreen(props) {
    var act_data = props.route.params.act_data;
    return (
        <View>
            <ActChart name={act_data.name} data={act_data.data}/>
        </View>
    );
}