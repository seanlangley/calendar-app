import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, setState} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const initialState = {
    isSignedIn: false,
    authToken: null,
    currActType: null,
}

function actApp(state = initialState, action) {
    switch (action.type) {
        case 'signin':
            return Object.assign({}, state, {
                isSignedIn: true,
                authToken: action.authToken
            });
        case 'signout':
            return Object.assign({}, state, {
                isSignedIn: false
            });
        case 'set_act_type':
            return Object.assign({}, state, {
                currActType: action.new_act_type
            });
        default:
            return state;
    }
}

const Stack = createStackNavigator();
const store = createStore(actApp);

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
                            {isSignedIn ? (
                                <>
                                    <Stack.Screen name="Home" component={HomeScreen} />
                                    <Stack.Screen name="TypeDetail" component={BottomTabNavigator} />
                                </>
                            ) : (
                                    <Stack.Screen name="Login" component={LoginScreen} />
                                )}
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
