import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default class App extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          width: "45%",
          height: "95%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#c9321a",
          borderRadius: 5,
          elevation: 3,
          borderWidth: 0.1,
        }}
        onPress={this.props.onPress}
      >
        <Text style={{ color: "white" }}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c9321a",
    padding: 10,
    borderRadius: 5,
  },
});
