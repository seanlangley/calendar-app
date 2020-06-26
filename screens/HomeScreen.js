import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

let url = 'http://localhost:8000/analyze_activities'


export default function HomeScreen({ navigation }) {
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

    function NameList(props){
        var type_buttons = [];
        props.act_data.forEach(act_types_list => {
            var act_name = act_types_list.name;
            type_buttons.push((
                <Button
                title={act_name}
                key={act_name}
                onPress={() => navigation.navigate('ActDetail', {
                    'act_data': act_types_list
                })}
                />));
        });
        return(type_buttons);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {isLoading ? <ActivityIndicator/> : (
                <NameList act_data={actData}/>
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
