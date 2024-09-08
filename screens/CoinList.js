import React from "react";
import { useEffect } from "react";
import { Text, Button, View, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLoggerContext } from "../contexts/LoggerProvider";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LogScreen() {
    const navigation = useNavigation();
    const [loggedEmail, setLoggedEmail] = useLoggerContext();
    const [, , , , , setSelectedCoins] = useLoggerContext();
    const API_URL = "http://172.22.25.50:3000";
    async function handleLogout() {
        await AsyncStorage.removeItem("@loggedEmail")
        setLoggedEmail([])
        navigation.push("Login")
    }
    function handlePress() {
        getCoin(loggedEmail);
    }
    //getting data from database
    async function getCoin(email) {
        try {
            const value = await AsyncStorage.getItem("@userToken");
            console.log(value)
            const url = `${API_URL}/api/all/${email}`
            let res = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + " " + value,
                },
            })
            if (res.status === 200) {
                console.log('fetched');
                const json = await res.json();
                const fetchedWatchlist = json.watchlist;
                const watchlistWithKeys = fetchedWatchlist.map((item) => ({
                    ...item,
                    event: item.name // Assign name as the key
                }));
                setSelectedCoins(watchlistWithKeys);
                await AsyncStorage.setItem("" + email, JSON.stringify(watchlistWithKeys));
            }
            else if (res.status === 202) {
                await AsyncStorage.setItem("" + email, JSON.stringify(null));
                setSelectedCoins([])
                Alert.alert('No Watchlist in server');

            }
            else {
                console.log('fetching failed');
            }
        }

        catch {

        }
    }

    return (
        <View >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, backgroundColor: 'lightblue' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Coins</Text>
                <TouchableOpacity onPress={() => { handleLogout() }}>
                    <Text style={{ fontSize: 16, color: 'red' }}>Logout</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonContainer}
                onPress={() => {
                    handlePress();
                }}
            >
                <Text style={styles.buttonText}>Sync with server</Text>
            </TouchableOpacity>
            <EventLogList />
        </View>
    );
}
function EventLogList() {
    const [, , , , log] = useLoggerContext();
    useEffect(() => {
        // Scroll to the bottom of the ScrollView when a new coin is added
    }, [log]);

    if (!log || log.length === 0) {
        return <Text style={styles.textStyle}>No coins available</Text>;
    }
    return (
        <ScrollView style={styles.container}>
            {log.map((x) => (
                <EventLog {...x} key={x.event} price={x.price} id={x.id} symbol={x.symbol} image={x.image} market_cap_rank={x.market_cap_rank} high_24h={x.high_24h} low_24h={x.low_24h} />
            ))}
        </ScrollView>
    );
}
function EventLog(props) {
    const navigation = useNavigation();
    const name = props.event;
    const id = props.id;
    const symbol = props.symbol;
    const image = props.image;
    const market_cap_rank = props.market_cap_rank;
    const high_24h = props.high_24h;
    const low_24h = props.low_24h;
    const [, , , , , , , deleteEventFromStorage] = useLoggerContext();

    const handleDelete = (id) => {
        deleteEventFromStorage(name, id)
    }
    return (
        <View>
            <View>
                <View style={styles.eventContainer}>
                    <Text style={styles.eventTitle} onPress={() => navigation.navigate("Details", { name, id, symbol, image, market_cap_rank, high_24h, low_24h })}>
                        {props.event}   ${props.price}
                    </Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => handleDelete(id)}>
                        <Text style={styles.delete_text}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View style={styles.event_data}>
                {props.data.map((x) => (
                    <Text key={x}>{new Date(x).toString()}</Text>
                ))}
            </View> */}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingLeft: 40,
        paddingRight: 40
    },
    // container: {
    //     flex: 1,
    //     backgroundColor: "#fff",

    // },
    eventTitle: {
        flex: 1,
        padding: 5,
        margin: 2,
        borderRadius: 10,
        fontSize: 30,
        borderWidth: 5,
        borderColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    eventData: {
        backgroundColor: "#fff",
        margin: 2,
    },
    buttonStyle: {
        backgroundColor: "red",
        padding: 10,
        alignItems: "flex-end"
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10, // Add some top margin to move it to the top
        borderRadius: 25, // Make the button rounded
        backgroundColor: 'blue', // Set a desired background color
        paddingVertical: 10, // Increase the size of the button
        shadowColor: 'black', // Add shadow properties
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white', // Set a desired text color
        fontSize: 16, // Set a desired font size
        fontWeight: 'bold',
    },
    textStyle: {
        fontSize: 20,
        alignSelf: "center",
        fontWeight: "500"
    },
});