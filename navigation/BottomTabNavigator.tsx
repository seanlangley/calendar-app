import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import ActDetailScreen from '../screens/ActDetailScreen';
import ActTableScreen from '../screens/TableScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Calendar';

export default function BottomTabNavigator({ navigation, route }: any) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Calendar"
        component={LinksScreen}
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
        }}
      />
      <BottomTab.Screen
        name="Tables"
        component={ActTableScreen}
        options={{
          title: 'Tables',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-grid" />,
        }}
      />
      <BottomTab.Screen
        name='Charts'
        component={ActDetailScreen}
        options={{
          title: 'Charts',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-analytics" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route: any) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Data View';
    case 'Links':
      return 'Calendar View';
  }
}
