import React, { Component } from "react";
import {
  View,
  Dimensions,
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

var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "",
      UserSurname: "",
      UserPhoneNumber: "",
      UserEmailAdress: "",
      UserPassword: "",
      email: "",
      password: "",
      repeatedPassword: "",
      errorMessage: null,
    };
  }

  handleSignUp = () => {
    if (this.state.UserName.trim() === "") {
      alert("I think you forgot to write your name 🤔");
      return;
    }
    if (this.state.UserSurname.trim() === "") {
      alert("Don't be shy, Go ahead and write your surname 😜");
      return;
    }
    if (this.state.UserPhoneNumber.trim() === "") {
      alert("I'm offended that you don't wanna give me your number 😒");
      return;
    }
    if (this.state.email.length == 0 || this.state.password.length == 0) {
      alert("You must enter both Email and Password");
      return;
    }
    if (this.state.password.length < 6) {
      alert("Please enter atleast 6 password characters");
      return;
    }
    if (this.state.repeatedPassword.trim() === "") {
      alert("It seems like you didn't retype the password");
      return;
    }
    if (this.state.password !== this.state.repeatedPassword) {
      alert("Ni khoto lwala-lwala? 🤣 Password adzi fani mah");
      return;
    }

    this.props.navigation.navigate("UserInfo", {
      UserName: this.state.UserName.trim(),
      UserSurname: this.state.UserSurname.trim(),
      UserPhoneNumber: this.state.UserPhoneNumber.trim(),
      UserEmailAdress: this.state.email.trim(),
      UserPassword: this.state.password.trim(),
    });
  };
  render() {
    return (
      <ImageBackground
        source={require("../../assets/images/signup.jpg")}
        resizeMode="stretch"
        imageStyle={{
          opacity: 0.8,
        }}
        style={styles.container}
      >
        <StatusBar backgroundColor="#990849" barStyle="light-content" />
        <ScrollView>
          <View
            style={{
              height: screenHeight * 0.07,
              justifyContent: "flex-end",
              alignContent: "center",
              marginBottom: 15,
              borderBottomColor: "white",
              borderBottomWidth: 2.5,
              margin: 3,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              SIGN-UP FOR ROYALCAFE ACCOUNT
            </Text>
          </View>
          <View style={{ padding: 5 }}>
            <View style={styles.inputview}>
              <Icon
                name="md-person"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="First Name"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ UserName: text });
                }}
              />
            </View>
            <View style={styles.inputview}>
              <Icon
                name="md-person"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Surname"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ UserSurname: text });
                }}
              />
            </View>
            <View style={styles.inputview}>
              <Icon
                name="md-call"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                keyboardType={"numeric"}
                style={styles.inputxt}
                placeholder="Phone number"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ UserPhoneNumber: text });
                }}
              />
            </View>
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
                onChangeText={(email) => this.setState({ email })}
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
            onPress={this.handleSignUp}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "white",
                textAlign: "center",
              }}
            >
              CREATE ACCOUNT
            </Text>
          </TouchableOpacity>
          {this.state.errorMessage && (
            <Text
              style={{
                marginHorizontal: 5,
                marginVertical: 5,
                color: "red",
                fontSize: 20,
                backgroundColor: "white",
              }}
            >
              {this.state.errorMessage}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              height: 32,
              paddingTop: 5,
            }}
          >
            <TouchableOpacity
              style={[styles.SDK]}
              onPress={() => alert("Login with FACEBOOK")}
            >
              <Image
                style={{
                  width: 30,
                  height: 30,
                  alignSelf: "center",
                }}
                source={{
                  uri:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEU6VZ////81Up0yT5xgc61+jbsvTZyXo8hFXaOirM0nSJmlrs7O1OUkRpkfQ5c1UZ1oerKHlcDp6/M9WKHHzeHV2ulxgravt9Td4Ozl6PGDkb7ByN5YbatQZ6j29/q3v9h2hrhMY6aQnMSsAnKHAAAC70lEQVR4nO3caXLiMBRFYdoihhhsQ5jDlPT+F9mdqv7bRrYQ7z7XOQug9BUWHiQzmRARERERERERERERERERqVe0IZQPCtaDHFwo62Yz/VrP3jtbrH0Sy7rYH46/YtpV1oPtX6jCbBel+2npThjq/Taa51AYmrdTH583YdHsP/r5nAnLTa/j05+w+ezv8yRsq/MQoB9hmPeegb6E5eU2DOhFWK4G+rwIw3CgD2G4Dge6ELaboXPQi7CJu4nwK6zvKUAHwvCVBHQgrFMmoQdh4jGqL2wviUB5YRP/uMKnsJ2mAtWF9XLkwjblcs2FsDqMXZh6LpQXhn06UFtYpZ7t5YX1wEczboTF/AlAaWFYP0OovPZU9pmGt9194W79sIq/Jt2uqqrytwbcxJ4NT9e6tR7soEIk8N749E2K7zjgubEe6dAi75yOboGxwrnTQ/RvRZTwIHy6e1SccF5Yj3N4UcJjbT3MhKKEh9J6mAlFCZWvyR4WJXxDqBxChPohRKgfQoT6IUSoH0KE+iFEqB9ChPqNQ1h0vKJcxWwt/aofvelsDFzNOlpECO9dH/DT+8ZUWMYgErNdfXuB8Ga7RPwCofHy2wuE59EfpQvbH9MXCNejF65st2q8QPhtu5Mhv/BmfE2TX/hhvGMqv3BpvBslv/BuvGUqv3A2+nloff+YX3gx3rmYX2j9CCC78Ga9NzO78GS9dTG7cDv679B8c2Z24e/R/9LsRy+8Wm/kzy60nobZhdb3TvmF9u8e5hYaP0p8gfB99PPQ/l2F3MKp+StDuYXWvuxC60eJ+YXm907ZhQJ/NlA+4d9ZOrrbH6WTzbyjmL+D/Oz6BNsl/H8V/y9E7TYpOz7BGveoceyn6QohQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLs0R8aFUYEFLSeAgAAAABJRU5ErkJggg==",
                }}
              />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 18,
                  alignSelf: "center",
                  color: "white",
                }}
              >
                FACEBOOK
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.SDKGOOGLE}
              onPress={() => alert("Login with GOOGLE")}
            >
              <Image
                style={{
                  width: 30,
                  height: 30,
                  alignSelf: "center",
                  borderRadius: 11,
                  marginLeft: 10,
                }}
                source={{
                  uri:
                    "data:image/png;base64,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",
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: "center",
                  marginLeft: 6,
                }}
              >
                GOOGLE
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.SDKWHICHQ}
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Image
              style={{
                width: 50,
                height: 40,
                alignSelf: "center",
                borderRadius: 11,
                marginLeft: 10,
              }}
              source={require("../../assets/icon.png")}
            />
            <Text
              style={{
                fontSize: 18,
                alignSelf: "center",
                marginLeft: 6,
              }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SDK: {
    flexDirection: "row",
    backgroundColor: "#3b5abf",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 11,
    width: 150,
    height: 40,
  },

  SDKGOOGLE: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 11,
    width: 150,
    height: 40,
  },
  SDKWHICHQ: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 11,
    width: 150,
    height: 40,
    marginLeft: "25%",
    marginTop: 20,
  },

  inputview: {
    flexDirection: "row",
    padding: 8,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 2,
    height: 55,
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
export default SignUpPage;
