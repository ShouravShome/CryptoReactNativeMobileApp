import React from "react";
import { Text, ScrollView, StyleSheet, View, TextInput } from "react-native";
import { useLoggerContext } from "../contexts/LoggerProvider";

import { useState, useEffect } from "react";

export default function RecordScreen() {

    const [, , log, setLog] = useLoggerContext();

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        setFilteredEvents(log); // Initialize the filtered events with the log initially
    }, [log]);

    // Function to handle search query changes
    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
        filterEvents(query);
    };
    const filterEvents = (query) => {
        if (query === "") {
            setFilteredEvents(log); // Show all events when search query is empty
        }
        else {
            const filtered = log.filter((event) =>
                event.event.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredEvents(filtered);
        }

    };
    return (
        <View style={styles.container}>
            <SearchBar
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                placeholder="Search coins...."
            />
            <EventList style={styles.eventRadious} events={filteredEvents} />
        </View>
    );
}
function SearchBar(props) {
    return (
        <TextInput
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            style={styles.searchBar}
        />
    );
}

function EventList(props) {
    return (
        <View >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={true}
            >
                {props.events.map((x) => (
                    <Event event={x.event} key={x.event} price={x.price} id={x.id} symbol={x.symbol} image={x.image} market_cap_rank={x.market_cap_rank} high_24h={x.high_24h} low_24h={x.low_24h} />
                ))}
            </ScrollView>

        </View>
    );
}
function Event(props) {
    const [, , , , , , addEvent] = useLoggerContext();
    const [, , , , , setSelectedCoins] = useLoggerContext();
    const handlePress = () => {
        setSelectedCoins((coins) => {
            return [...coins, props.event];
        });
        addEventCoin(props.event);
    };
    return (
        <Text onPress={() => addEvent(props.event, props.price, props.id, props.symbol, props.image, props.market_cap_rank, props.high_24h ,props.low_24h)} style={styles.event}>
            {props.event}
        </Text>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    eventRadious: {
        borderRadius: 15
    },
    event: {
        backgroundColor: "green",
        textAlign: "center",
        padding: 5,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 20,
        marginBottom: 15

    },
    searchBar: {
        padding: 10,
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10
    },
});