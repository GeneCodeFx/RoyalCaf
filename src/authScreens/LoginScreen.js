import React, { Component } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as firebase from "firebase";

class LoginScreen extends Component {
  state = { email: "", password: "", errorMessage: null };

  handleLogin = () => {
    if (this.state.email.length == 0 || this.state.password.length == 0) {
      alert("You must enter both Email and Password");
      return;
    }
    let email = this.state.email.trim();
    let password = this.state.password.trim();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("RoyalCafe"))
      .catch((error) => this.setState({ errorMessage: error.message }));
  };
  render() {
    return (
      <ImageBackground
        source={require("../../assets/images/login.jpg")}
        //resizeMode='cover'
        imageStyle={{
          opacity: 0.8,
          width: "100%",
          height: "100%",
        }}
        style={styles.container}
      >
        <StatusBar backgroundColor="#990849" barStyle="light-content" />
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              height: "25%",
              paddingLeft: "5%",
              justifyContent: "center",
              alignContent: "center",
              marginVertical: 15,
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                borderRadius: 100,
              }}
              source={require("../../assets/logo.png")}
            />
            <Text
              style={{
                fontSize: 25,
                color: "#332033",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              WELCOME TO WHICHQ
            </Text>
          </View>
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
                keyboardType="email-address"
                placeholder="Enter your Email"
                placeholderTextColor="white"
                autoCapitalize="none"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
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
                placeholderTextColor="white"
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#990849",
                height: 50,
                width: 300,
                marginTop: 5,
                borderRadius: 30,
                alignSelf: "center",
                justifyContent: "center",
              }}
              onPress={this.handleLogin}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            {this.state.errorMessage && (
              <Text
                style={{
                  marginTop: 5,
                  color: "red",
                  backgroundColor: "white",
                  fontSize: 20,
                }}
              >
                {this.state.errorMessage}
              </Text>
            )}
            <TouchableOpacity
              style={{
                paddingLeft: 5,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                width: "80%",
                marginTop: 3,
                marginTop: 20,
                flexDirection: "row",
              }}
              onPress={() => alert("Reset Function Comimg Soon")}
            >
              <Icon
                name="md-key"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: "center",
                  color: "white",
                }}
              >
                Forgot your Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingLeft: 5,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                width: "80%",
                marginTop: 3,
                flexDirection: "row",
              }}
              onPress={() => this.props.navigation.navigate("SignUpPage")}
            >
              <Icon
                name="md-create"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  //fontFamily: "Acme-Regular",
                  alignSelf: "center",
                }}
              >
                Create WHICHQ Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logIn: {
    flex: 1,
    padding: 5,
    height: 360,
  },

  SDK: {
    flexDirection: "row",
    backgroundColor: "#3b5abf",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 11,
    width: 150,
    height: 50,
  },

  SDKGOOGLE: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 11,
    width: 150,
    height: 50,
  },

  inputview: {
    flexDirection: "row",
    padding: 8,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 2,
    height: 60,
    borderRadius: 5,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },

  icons: {
    width: "10%",
    alignSelf: "center",
  },

  inputxt: {
    fontSize: 18,
    height: "100%",
    width: "90%",
    marginBottom: 3,
  },
});

export default LoginScreen;
