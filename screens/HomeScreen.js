import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
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



export default function HomeScreen() {
    const [actData, setActData] = useState();
    const [isLoading, setLoading] = useState(true);

    function initialize_data(act_types_list){
        var view_month_data = [];
        act_types_list.forEach(type_data => {
            var new_type_entry = {'name': type_data['name'], 'data': []};
            var month_data = type_data['month_table'];
            month_data.forEach((month, idx) => {
                new_type_entry['data'].push({'month': idx, 'ratio': month['Ratio']});
            });
            view_month_data.push(new_type_entry);
        });
        
        setActData(view_month_data);
    }

    useEffect(() => {
        if(isLoading){
            fetch(url)
                .then(response => response.json())
                .then(json => initialize_data(json))
                .catch(error => console.error(error))
                .finally(() => setLoading(false));
        }
    });

    function ChartList(props){
        var charts = [];
        actData.forEach(act_types_list => {
            var act_name = act_types_list.name;
            var textkey = act_name + "text";
            var data = act_types_list.data;
            charts.push((<Text key={textkey}>{act_name}</Text>))
            charts.push((<Chart data={data} key={act_name}/>));
        });
        return(charts);
    }

    function Chart(props){
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
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {isLoading ? <ActivityIndicator/> : (
                <ChartList/>
            )}
            <Button
            title={"Refresh"}
            onPress={() => setLoading(true)}
            />
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
