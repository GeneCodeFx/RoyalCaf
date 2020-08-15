import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import firebase from "firebase";

export default class storeUserData extends React.Component {
  componentDidMount() {
    const rootRef = firebase
      .database()
      .ref("Users/" + firebase.auth().currentUser.uid);
    rootRef.update({
      UserName: this.props.navigation.state.params.UserName,
      UserSurname: this.props.navigation.state.params.UserSurname,
      UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
      UserEmailAdress: this.props.navigation.state.params.UserEmailAdress,
      UserPassword: this.props.navigation.state.params.UserPassword,
      ShopperPicture: this.props.navigation.state.params.dpImage,
      Country: this.props.navigation.state.params.Country,
      Province: this.props.navigation.state.params.Province,
      Town: this.props.navigation.state.params.Town,
    });
    this.props.navigation.navigate("RoyalCafe");
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Finishing...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
