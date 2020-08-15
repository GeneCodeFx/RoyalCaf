import React, { Component } from "react";
import * as Permissions from "expo-permissions";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";

var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class error extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dpImage:
        "https://cdn2.iconfinder.com/data/icons/action-states-vol-4-flat/48/Action___States_-_Vol._4-10-512.png",
      Message: this.props.navigation.state.params.errorMessage,
      Province: "",
      Town: "",
      uploading: false,
      email: "",
      password: "",
      repeatedPassword: "",
    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    const { navigate } = this.props.navigation;

    const bkgroundImage =
      "https://i.pinimg.com/originals/9c/81/c4/9c81c4bf33805aec8efa01cd70ce8a88.jpg";
    return (
      <ImageBackground
        source={{ uri: bkgroundImage }}
        resizeMode="stretch"
        imageStyle={{
          opacity: 0.8,
        }}
        style={styles.container}
      >
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              height: screenHeight * 0.07,
              justifyContent: "flex-end",
              alignContent: "center",
              borderBottomColor: "#990849",
              borderBottomWidth: 2.5,
              margin: 3,
            }}
          >
            <Text
              style={{
                fontSize: 23,
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Oops!
            </Text>
          </View>
          {this.state.Message && (
            <View
              style={{
                height: screenHeight * 0.03,
                justifyContent: "center",
                alignContent: "center",
                margin: 3,
                borderBottomColor: "black",
              }}
            >
              <Text
                style={{
                  marginTop: one * 20,
                  color: "white",
                  backgroundColor: "red",
                  fontSize: 20,
                }}
              >
                {this.state.Message}
              </Text>
            </View>
          )}
          <View style={styles.logIn}>
            <View style={styles.inputview}>
              <Icon
                name="md-mail"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(email) =>
                  this.setState({ email, Message: null })
                }
                value={this.state.email}
                placeholderTextColor="white"
              />
            </View>
            <View style={styles.inputview}>
              <Icon
                name="md-lock"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                placeholderTextColor="white"
              />
            </View>
            <View style={styles.inputview}>
              <Icon
                name="md-lock"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Repeat Password"
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ repeatedPassword: text });
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#bf229a",
                height: one * 50,
                width: one * 300,
                marginTop: one * 10,
                borderRadius: one * 30,
                alignSelf: "center",
                justifyContent: "center",
              }}
              onPress={this.LeGo}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                }}
              >
                DONE
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  LeGo = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.email.trim(),
        this.state.password.trim()
      )
      .then(() =>
        this.props.navigation.navigate("storeUserData", {
          UserName: this.props.navigation.state.params.UserName,
          UserSurname: this.props.navigation.state.params.UserSurname,
          UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
          UserEmailAdress: this.state.email.trim(),
          UserPassword: this.state.password.trim(),
          dpImage: this.props.navigation.state.params.dpImage,
          Country: this.props.navigation.state.params.Country,
          Province: this.props.navigation.state.params.Province,
          Town: this.props.navigation.state.params.Town,
        })
      )
      .catch((error) => this.setState({ Message: error.message }));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logIn: {
    flex: 1,
    padding: one * 5,
    marginTop: 5,
    paddingTop: one * 10,
  },

  inputview: {
    flexDirection: "row",
    padding: one * 8,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: one * 2,
    height: one * 55,
    borderRadius: one * 5,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },

  icons: {
    width: "10%",
    alignSelf: "center",
  },

  inputxt: {
    fontSize: one * 18,
    height: "100%",
    width: "90%",
    marginBottom: 3,
  },
});
