import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import firebase from "firebase";

export default class saveUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
    };
  }

  componentDidMount() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.props.navigation.state.params.UserEmailAdress,
        this.props.navigation.state.params.UserPassword
      )
      .then(() =>
        this.props.navigation.navigate("storeUserData", {
          UserName: this.props.navigation.state.params.UserName,
          UserSurname: this.props.navigation.state.params.UserSurname,
          UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
          UserEmailAdress: this.props.navigation.state.params.UserEmailAdress,
          UserPassword: this.props.navigation.state.params.UserPassword,
          dpImage: this.props.navigation.state.params.dpImage,
          Country: this.props.navigation.state.params.Country,
          Province: this.props.navigation.state.params.Province,
          Town: this.props.navigation.state.params.Town,
        })
      )
      .catch((error) => this.setState({ errorMessage: error.message }));
  }
  render() {
    if (this.state.errorMessage !== null) {
      () =>
        this.props.navigation.navigate("error", {
          UserName: this.props.navigation.state.params.UserName,
          UserSurname: this.props.navigation.state.params.UserSurname,
          UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
          UserEmailAdress: this.props.navigation.state.params.UserEmailAdress,
          UserPassword: this.props.navigation.state.params.UserPassword,
          dpImage: this.props.navigation.state.params.dpImage,
          Country: this.props.navigation.state.params.Country,
          Province: this.props.navigation.state.params.Province,
          Town: this.props.navigation.state.params.Town,
        });
    }
    return (
      <View style={styles.container}>
        <Text>Just a second</Text>
        <ActivityIndicator size="large" />
        {this.state.errorMessage &&
          this.props.navigation.navigate("error", {
            UserName: this.props.navigation.state.params.UserName,
            UserSurname: this.props.navigation.state.params.UserSurname,
            UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
            UserEmailAdress: this.props.navigation.state.params.UserEmailAdress,
            UserPassword: this.props.navigation.state.params.UserPassword,
            dpImage: this.props.navigation.state.params.dpImage,
            Country: this.props.navigation.state.params.Country,
            Province: this.props.navigation.state.params.Province,
            Town: this.props.navigation.state.params.Town,
            errorMessage: this.state.errorMessage,
          })}
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
