import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, setState} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import ActDetailScreen from './screens/ActDetailScreen';
import LoginScreen from './screens/LoginScreen';

const initialState = {
    isSignedIn: false
}

function actApp(state = initialState, action) {
    switch (action.type) {
        case 'login':
            return Object.assign({}, state, {
                isSignedIn: action.isSignedIn
            });
        default:
            return state;
    }
}

const Stack = createStackNavigator();

export default function App(props) {
    const isLoadingComplete = useCachedResources();
    const store = createStore(actApp);
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
                                    <Stack.Screen name="Root" component={BottomTabNavigator} />
                                    <Stack.Screen name="ActDetail" component={ActDetailScreen} />
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
