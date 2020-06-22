import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

export default function HomeScreen() {
  new_data = []
  return (
    <View style={styles.container}>
        <FlatList
        data={new_data}
        renderItem={({item}) => <Text>{item.key}</Text>}
        />
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

ActivityList = () => {
  return (
    <FlatList
    data={DATA}
    renderItem={({item}) => <Text>{item['day']}</Text>}
    />
  );
}

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
