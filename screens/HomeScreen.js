import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VictoryBar } from 'victory-native';



var url = 'http://localhost:8000/analyze_activities'


const Item = ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

export default function HomeScreen() {
    const [actData, setActData] = useState();
    const [isLoading, setLoading] = useState(true);

    function initialize_data(data){
        setActData(data);
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
            <VictoryBar/>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
