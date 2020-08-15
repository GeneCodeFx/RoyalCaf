import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }) => (
  <View
    style={{
      backgroundColor: "#fff",
      flex: 1,
      marginTop: 20,
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        //paddingTop: 40,
        //alignItems: "center",
        height: "10%",
        flexDirection: "row",
        //justifyContent: "space-around",
        marginLeft: 9,
      }}
    >
      <TouchableOpacity
        style={{ alignSelf: "center" }}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="ios-menu" size={32} />
      </TouchableOpacity>
      <Text style={{ alignSelf: "center", marginLeft: 9 }}>Settings </Text>
    </View>
    <Text style={{ marginTop: "50%", alignSelf: "center" }}>
      Profile Still Under Construction
    </Text>
  </View>
);

export default Settings;
