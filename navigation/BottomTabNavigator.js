import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import * as React from "react";
import TabBarIcon from "../components/TabBarIcons";
import CoinList from "../screens/CoinList";
import SearchCoin from "../screens/SearchCoin";
import { useEffect } from "react";
import { Alert } from "react-native-web";
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

function handleBackButton() {
    Alert.alert('Cannot back');
    return;
}

export default function BottomTabNavigator({ navigation, route }) {
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault(); // Prevent the default behavior
            handleBackButton(); // Call the custom back button handler
        });
    }, []);
    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Home"
                component={CoinList}
                options={{
                    title: "Coins List",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-code-working" />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Search"
                component={SearchCoin}
                options={{
                    title: "Search Coins",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-book" />
                    ),

                }}
            />
        </BottomTab.Navigator>

    );
}