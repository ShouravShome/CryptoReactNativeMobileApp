import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_URL = "http://172.22.25.50:3000";


//database insert
async function insertCoin(email, name, price, coin, symbol, image, market_cap_rank, high_24h, low_24h) {
    try {

        const value = await AsyncStorage.getItem("@userToken");
        console.log(value)
        const url = `${API_URL}/api/watchlist`
        let res = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + value,
            },
            body: JSON.stringify({
                email: email,
                name: name,
                price: price,
                coin: coin,
                symbol: symbol,
                image: image,
                market_cap_rank: market_cap_rank,
                high_24h: high_24h,
                low_24h: low_24h,
            })
        })
        if (res.status === 200) {
            console.log('Inserted');
            Alert.alert('Success', "Coin Inserted!!")
        }
        else if (res.status === 202) {
            Alert.alert('Error', 'Coin already added in server. Please sync with server')
        }
        else {
            console.log('Insertion failed');
            // Handle failed registration
        }
    }

    catch {

    }
}

//database deletion
async function deleteCoin(email, coin) {
    try {
        const value = await AsyncStorage.getItem("@userToken");
        console.log(value)
        const url = `${API_URL}/api/watchlist/delete`
        let res = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + value,
            },
            body: JSON.stringify({
                email: email,
                coin: coin
            })
        })
        if (res.status === 200) {
            console.log('Deleted');
            // Handle successful registration
            // Alert.alert('Error', 'User already exists!!!')
            // setEmail("")
            // setPassword("")
        } else if (res.status === 401) {
            Alert.alert('Error', 'Unauthorized')
        }
        else if (res.status === 202) {
            Alert.alert('Error', 'Already Deleted from server. Please Sync with server.')
        }
        else {
            console.log('Deletion failed');
            // Handle failed registration
        }
    }

    catch {

    }
}

//adding coins from search to main list
async function addEvent(event, price, id, symbol, image, market_cap_rank, high_24h, low_24h, email, state, setState) {
    const coinIndex = state.findIndex((coin) => coin.event === event);
    if (coinIndex === -1) {
        const coins = [...state, { event, price, id, symbol, image, market_cap_rank, high_24h, low_24h }];
        // setState((coins) => [...coins, { event, price, id }]);
        setState(coins)
        // const email = "test@gmail.com";


        await AsyncStorage.setItem(""+email, JSON.stringify(coins));
    }
    insertCoin(email, event, price, id, symbol, image, market_cap_rank, high_24h, low_24h)
}

//deleting coins from main list
async function deleteEventFromStorage(event, id, email, state, setState) {
    const coinIndex = state.filter((coin) => coin.event !== event);

    // const coins = [...state, { event, price, id }];
    // setState((coins) => [...coins, { event, price, id }]);
    setState(coinIndex)

    await AsyncStorage.setItem(""+email, JSON.stringify(coinIndex));
    // const email = "test@gmail.com";
    deleteCoin(email, id)
}

export const LoggerContext = createContext();
export const useLoggerContext = () => useContext(LoggerContext);
export const LoggerProvider = ({ children }) => {
    const [state, setState] = useState([]);
    const [selectedCoins, setSelectedCoins] = useState([]);
    const [loggedEmail, setLoggedEmail] = useState([]);
    useEffect(() => {
        fetchCoinData();
    }, []);

    const fetchCoinData = async () => {
        // await AsyncStorage.clear();
        try {
            const response = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
            );
            const coins = response.data.map((coin) => ({
                event: coin.name,
                price: coin.current_price,
                id: coin.id,
                symbol: coin.symbol,
                image: coin.image,
                market_cap_rank: coin.market_cap_rank,
                high_24h: coin.high_24h,
                low_24h: coin.low_24h,
            }));
            setState(coins);
            console.log("CoinGecko API data fetched successfully:", coins);
        } catch (error) {
            console.log("Error fetching CoinGecko API data:", error);
        }
    };
    let _retrieveData = async (loggedEmail) => {
        try {
            //const loggedEmail = await AsyncStorage.getItem("@loggedEmail");
            setSelectedCoins([])
            console.log(loggedEmail)
            const value = await AsyncStorage.getItem(""+loggedEmail);
            console.log(value);
            if (value === null) {
                console.log(value)
                console.log("nulllll")
                setSelectedCoins([])
            } else {
                console.log(value)
                setSelectedCoins(JSON.parse(value));
                console.log("something")
            }
        } catch (error) {

            // Error retrieving data
        }
    };
    useEffect(() => {
        _retrieveData(loggedEmail);
    }, [loggedEmail]);

    return (
        <LoggerContext.Provider
            value={[loggedEmail, setLoggedEmail, state, setState, selectedCoins, setSelectedCoins, (x, price, id, symbol, image, market_cap_rank, high_24h, low_24h) => addEvent(x, price, id, symbol, image, market_cap_rank, high_24h, low_24h, loggedEmail, selectedCoins, setSelectedCoins), (event, id) => deleteEventFromStorage(event, id, loggedEmail, selectedCoins, setSelectedCoins)]}
        >
            {children}
        </LoggerContext.Provider>
    );
};
