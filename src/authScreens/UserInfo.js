import React, { Component } from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
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

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dpImage:
        "https://cdn2.iconfinder.com/data/icons/action-states-vol-4-flat/48/Action___States_-_Vol._4-10-512.png",
      Country: "",
      Province: "",
      Town: "",
      uploading: false,
      UserName: this.props.navigation.state.params.UserName,
      UserSurname: this.props.navigation.state.params.UserSurname,
      UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
      UserEmailAdress: this.props.navigation.state.params.UserEmailAdress,
      UserPassword: this.props.navigation.state.params.UserPassword,
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
        <StatusBar backgroundColor="#990849" barStyle="light-content" />
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
              WELCOME TO WHICHQ
            </Text>
          </View>
          <View
            style={{
              height: screenHeight * 0.03,
              justifyContent: "center",
              alignContent: "center",
              margin: 3,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Hi {this.props.navigation.state.params.ShopperName}, help us to
              help you better ✨
            </Text>
          </View>

          <View
            style={{
              marginTop: 5,
              width: screenWidth * 0.8,
              borderRadius: 3,
              elevation: 5,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={this._pickImage}
              style={{
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
                shadowColor: "rgba(0,0,0,1)",
                shadowOpacity: 0.2,
                shadowOffset: { width: 4, height: 4 },
                shadowRadius: 5,
                overflow: "hidden",
                alignSelf: "center",
              }}
            >
              <Image
                source={{ uri: this.state.dpImage }}
                style={{
                  width: screenWidth * 0.8,
                  height: screenWidth * 0.55,
                }}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                fontSize: 18,
                backgroundColor: "#990849",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              Help WhichQ People to identify you when you arrive to the store
            </Text>
          </View>

          <View style={styles.logIn}>
            <View style={styles.inputview}>
              <Icon
                name="md-airplane"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Your country"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ Country: text });
                }}
              />
            </View>
            <View style={styles.inputview}>
              <Icon
                name="md-planet"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Your province"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ Province: text });
                }}
              />
            </View>
            <View style={styles.inputview}>
              <Icon
                name="md-car"
                color={"white"}
                size={24}
                style={styles.icons}
              />
              <TextInput
                style={styles.inputxt}
                placeholder="Your Town/City"
                placeholderTextColor="white"
                onChangeText={(text) => {
                  this.setState({ Town: text });
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#841584",
                height: 50,
                width: 300,
                marginTop: 10,
                borderRadius: 30,
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
                  //fontFamily: "Acme-Regular",
                  textAlign: "center",
                }}
              >
                LET'S GO SHOPPING 🤑
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  LeGo = () => {
    this.props.navigation.navigate("saveUser", {
      UserName: this.props.navigation.state.params.UserName,
      UserSurname: this.props.navigation.state.params.UserSurname,
      UserPhoneNumber: this.props.navigation.state.params.UserPhoneNumber,
      UserEmailAdress: this.props.navigation.state.params.UserEmailAdress,
      UserPassword: this.props.navigation.state.params.UserPassword,
      dpImage: this.state.dpImage,
      Country: this.state.Country,
      Province: this.state.Province,
      Town: this.state.Town,
    });
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({
        uploading: true,
        dpImage: "https://media.giphy.com/media/ZLeczmapXFUqc/giphy.gif",
      });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ dpImage: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert(
        "Oops! Upload failed 😔 Please check your internet connection and try again"
      );
      this.setState({
        dpImage:
          "https://cdn2.iconfinder.com/data/icons/action-states-vol-4-flat/48/Action___States_-_Vol._4-10-512.png",
      });
    } finally {
      this.setState({ uploading: false });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logIn: {
    flex: 1,
    padding: 5,
    marginTop: 5,
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

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref("PractiseImages").child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}
