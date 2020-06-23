import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
const moment = require('moment');
moment.locale('en');
let months_as_str = moment.monthsShort()
var month_indices = [];
for (var i = 0; i < 12; i++){
    month_indices.push(i);
}

let url = 'http://localhost:8000/analyze_activities'

function Chart(props){
    if(props.is_loading){
        return <ActivityIndicator/>
    }
    else {
        return (
            <VictoryChart>
            <VictoryAxis
            tickValues={month_indices}
            tickFormat={months_as_str}
            />
            <VictoryAxis
            dependentAxis
            tickFormat={x => (x)}
            />
            <VictoryBar
            data={props.data}
            x='month'
            y='ratio'
            />
            </VictoryChart>
        )
    }
}


export default function HomeScreen() {
    const [actData, setActData] = useState();
    const [isLoading, setLoading] = useState(true);

    function initialize_data(act_types_list){
        type_data = act_types_list[0];
        month_data = type_data['month_table'];
        view_month_data = [];
        month_data.forEach((month, idx) => {
            view_month_data.push({'month': idx, 'ratio': month['Ratio']});
        });
        
        setActData(view_month_data);
    }

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(json => initialize_data(json))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    });
    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Chart data={actData} is_loading={isLoading}/>
            <View style={styles.getStartedContainer}>
                <DevelopmentModeNotice />
            </View>
            </ScrollView>
        </View>
    );
}

HomeScreen.navigationOptions = {
    header: null,
};


function DevelopmentModeNotice() {
    if (__DEV__) {
        const learnMoreButton = (
            <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
                Learn more
            </Text>
        );

        return (
            <Text style={styles.developmentModeText}>
                Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
            </Text>
        );
    } else {
        return (
            <Text style={styles.developmentModeText}>
                You are not in development mode: your app will run at full speed.
            </Text>
        );
    }
}

function handleLearnMorePress() {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
});
