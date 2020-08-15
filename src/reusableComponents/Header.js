import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingTop: 40,
        alignItems: "center",
        flex: 1,
      }}
    >
      <TouchableOpacity onPress={() => openDrawer()}>
        <Ionicons name="ios-menu" size={32} />
      </TouchableOpacity>
      <Text>{this.props.name}</Text>
      <Text style={{ width: 50 }}></Text>
    </View>
  );
};

export default Header;
