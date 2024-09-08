
import { StyleSheet, View, Text, Image } from "react-native";
import { useLoggerContext } from "../contexts/LoggerProvider";
import { useRoute } from "@react-navigation/core";
import { useEffect, useState, useRef } from "react";
import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

import login from "../static/login.png"

function ScreenB() {
  const route = useRoute();
  // Retrieve the passed variable from the route params
  const { name, id, symbol, image, market_cap_rank, high_24h, low_24h } = route.params;
  const [marketChartData, setMarketChartData] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchMarketChartData();
  }, []);
  const chartRef = useRef(null);
  const fetchMarketChartData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=aud&days=7&interval=daily`
      );
      const data = await response.json();
      const timestamps = data.prices.map((entry) => {
        const timestamp = entry[0];
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-AU", {
          day: "2-digit",
          month: "2-digit",
        });
      });
      const prices = data.prices.map((entry) => entry[1]);
      // setMarketChartData(data);
      console.log("Market chart data:", data);
      const chartData = {
        labels: timestamps,
        datasets: [
          {
            data: prices,
          },
        ],
      };
      setMarketChartData(chartData)
      return chartData;
    } catch (error) {
      console.log("Error fetching market chart data:", error);
    }
  };
  // useEffect(() => {
  //   if (chartRef.current) {
  //     const canvas = document.getElementById('myChart');
  //     const ctx = canvas.getContext('2d');
  //     new Chart(ctx, {
  //       type: 'line',
  //       data: marketChartData,
  //     });
  //   }
  // }, [marketChartData]);
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: image }} style={styles.logo} />
      </View>
      <View style={styles.textInfo}>
        <Text style={styles.textInfo}>Name:                 {name}</Text>
        <Text style={styles.textInfo}>Coin Id:              {id}</Text>
        <Text style={styles.textInfo}>Coin Symbol:          {symbol}</Text>
        <Text style={styles.textInfo}>Market Rank:          {market_cap_rank}</Text>
        <Text style={styles.textInfo}>High Price in 24 hour:{high_24h}</Text>
        <Text style={styles.textInfo}>Low Price in 24 hour  {low_24h}</Text>
      </View>
      <Text style={styles.graphTitle}>
        Graph for last 7 days price against AUD.
      </Text>
      {marketChartData ? (
        <LineChart
          data={marketChartData}
          width={screenWidth}
          height={200}
          chartConfig={{
            backgroundColor: '#1E2923', // Dark background color
            // Dark gradient end opacity
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // Bright line color
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false,
            labelFontSize: 12, // optional, adjust as needed
          }}
          style={styles.graphStyle}
        />
      ) : (
        <Text>Loading chart data...</Text>
      )}
    </View>

  );
}
export default function SelectedCoinsScreen() {

  return (
    <View>
      <ScreenB />
    </View>
  );


}
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  logoContainer: {

    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  textInfo: {
    fontSize: 20,
    fontWeight: "800",
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: "900",
    alignSelf: "center",
    marginTop:20
  },
  graphStyle:{
    marginRight:20,
  }
})