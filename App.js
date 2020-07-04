import { NavigationContainer } from '@react-navigation/native';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, setState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Provider, connect } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import rootReducer from './redux/reducers';

const loggerMiddleware = createLogger()

const Stack = createStackNavigator();
const store = createStore(rootReducer,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    )
);

export default function App(props) {
    const isLoadingComplete = useCachedResources();
    const [isSignedIn, setSignedIn] = useState(false);
    store.subscribe(() => setSignedIn(store.getState().isSignedIn))

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
                    <NavigationContainer linking={LinkingConfiguration}>
                        <Stack.Navigator>
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="TypeDetail" component={BottomTabNavigator} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
