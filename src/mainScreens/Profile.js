import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation }) => (
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
        justifyContent: "space-around",
      }}
    >
      <TouchableOpacity
        style={{ alignSelf: "center" }}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="ios-menu" size={32} />
      </TouchableOpacity>
      <Text style={{ alignSelf: "center" }}>
        Welcome to your Royal Cafeteria Profile{" "}
      </Text>
    </View>
    <Text style={{ marginTop: "50%", alignSelf: "center" }}>
      Profile Page Coming Soon
    </Text>
  </View>
);

export default Profile;
