import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation }) => (
  <View
    style={{
      backgroundColor: "#fff",
      paddingTop: 40,
      alignItems: "center",
      flex: 1,
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        paddingTop: 40,
        alignItems: "center",
        flex: 1,
      }}
    >
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="ios-menu" size={32} />
      </TouchableOpacity>
      <Text>Home</Text>
      <Text style={{ width: 50 }}></Text>
    </View>
    <Text style={{ padding: 20 }}>This is our Home screen</Text>
  </View>
);

export default Home;
