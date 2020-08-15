import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler,
  Image,
} from "react-native";
import firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Modal from "react-native-modalbox";
import Button from "react-native-button";

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class clearCartView extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.navigation.state.params.products,
      StoreName: this.props.navigation.state.params.StoreName,
      StoreLocation: this.props.navigation.state.params.StoreLocation,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      const { navigation } = this.props;
      this.focusListener = navigation.addListener("didFocus", () => {
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.handleBackButton
        );
        this._clearCartOptimized();
        setTimeout(() => {
          this.props.navigation.navigate("RoyalCafe");
        }, 100);
      });

      this.focusListener = navigation.addListener("didBlur", () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.handleBackButton
        );
      });
    }
  }

  handleBackButton = () => {
    return true;
  };

  _clearCartOptimized = () => {
    let itemsOnCart = this.state.products;
    let userID = firebase.auth().currentUser.uid;
    let storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    itemsOnCart.forEach((item) => {
      if (item.subCatagory !== "NotModal") {
        let itemReference = `STORES/${storeLocator}/ITEMS DATABASE/${item.productCatagory}/PRODUCTS/${item.subCatagory}/SIMILAR ITEMS/${item.productDecription}/onCart/${userID}`;
        firebase.database().ref(itemReference).remove();
      } else {
        let itemReference = `STORES/${storeLocator}/ITEMS DATABASE/${item.productCatagory}/PRODUCTS/${item.productDecription}/onCart/${userID}`;
        firebase.database().ref(itemReference).remove();
      }
    });

    firebase
      .database()
      .ref(`Users/${userID}/Current_Cart/${storeLocator}/Balance`)
      .update({
        noItems: 0,
        Total: 0,
      });
    firebase
      .database()
      .ref(`Users/${userID}/Current_Cart/${storeLocator}/SelectedItems`)
      .remove();
    //this.setState({ deleting: false });
    //this.props.navigation.navigate("HomePage");
    //this.props.navigation.goBack();
  };

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  _clearCartOptimized = () => {
    let itemsOnCart = this.state.products;
    let userID = firebase.auth().currentUser.uid;
    let storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    itemsOnCart.forEach((item) => {
      if (item.subCatagory !== "NotModal") {
        let itemReference = `STORES/${storeLocator}/ITEMS DATABASE/${item.productCatagory}/PRODUCTS/${item.subCatagory}/SIMILAR ITEMS/${item.productDecription}/onCart/${userID}`;
        firebase.database().ref(itemReference).remove();
      } else {
        let itemReference = `STORES/${storeLocator}/ITEMS DATABASE/${item.productCatagory}/PRODUCTS/${item.productDecription}/onCart/${userID}`;
        firebase.database().ref(itemReference).remove();
      }
    });

    firebase
      .database()
      .ref(`Users/${userID}/Current_Cart/${storeLocator}/Balance`)
      .update({
        noItems: 0,
        Total: 0,
      });
    firebase
      .database()
      .ref(`Users/${userID}/Current_Cart/${storeLocator}/SelectedItems`)
      .remove();
    //this.refs.pleaseWaitModal.close();
    this.setState({ deleting: false });
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: screenHeight * 0.06,
            width: "100%",
            backgroundColor: "#ed0971",
            justifyContent: "center",
            paddingHorizontal: one * 10,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: "white",
            }}
          >
            Please wait...
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            alignItems: "center",
            alignContent: "center",
            height: "87%",
          }}
        >
          <View
            style={{
              height: "5%",
              width: "100%",
              //backgroundColor: "red",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "black",
                fontSize: one * 20,
                fontWeight: "bold",
              }}
            >
              We're informing the store to wait a bit
            </Text>
          </View>
          <View
            style={{
              height: "85%",
              width: "100%",
              //backgroundColor: "#ed0971",
              justifyContent: "center",
              alignItems: "center",
              //marginTop: one * 20,
            }}
          >
            <Image
              style={{ width: "97%", height: "70%" }}
              source={require("../../assets/gifs/pleaseWait.gif")}
            />
          </View>
          <View
            style={{
              height: "10%",
              width: "100%",
              //backgroundColor: "red",
              //justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                //alignSelf: "center",
                color: "black",
                fontSize: one * 20,
              }}
            >
              This shouldn't take time
            </Text>
          </View>
        </View>
        <View
          style={{
            height: screenHeight * 0.07,
            width: "100%",
            backgroundColor: "#ed0971",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              height: screenHeight * 0.07,
              width: "25%",
              flexDirection: "row",
              paddingLeft: one * 10,
            }}
          ></View>

          <View
            style={{
              height: "85%",
              width: "49%",
              backgroundColor: "red",
              //alignContent: 'center',
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: one * 4,
              borderWidth: one,
              //marginTop: one*3,
              alignSelf: "center",
            }}
          ></View>
          <View
            style={{
              height: screenHeight * 0.07,
              width: "26%",
              //backgroundColor: 'black',
              justifyContent: "center",
              paddingLeft: one * 5,
              //paddingRight: one*10,
              alignSelf: "flex-end",
            }}
          ></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    backgroundColor: "#fcfcfc",
    marginTop: 20,
  },
});
