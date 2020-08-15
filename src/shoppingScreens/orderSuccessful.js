import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  FlatList,
} from "react-native";
import firebase from "firebase";

import Button from "react-native-button";
import * as Font from "expo-font";

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class orderSuccessful extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      balance: this.props.navigation.state.params.balance,
      products: this.props.navigation.state.params.products,
      noItems: this.props.navigation.state.params.noItems,
      StoreName: this.props.navigation.state.params.StoreName,
      StoreLocation: this.props.navigation.state.params.StoreLocation,
      collectionDate: this.props.navigation.state.params.collectionDate,
      collectionTime: this.props.navigation.state.params.collectionTime,
      fontLoaded: true,
    };
    this.webView = null;
  }

  async componentDidMount() {
    await Font.loadAsync({
      "LibreBaskerville-Bold": require("../../assets/fonts/LibreBaskerville-Bold.ttf"),
      "LibreBaskerville-Italic": require("../../assets/fonts/LibreBaskerville-Italic.ttf"),
      "LibreBaskerville-Regular": require("../../assets/fonts/LibreBaskerville-Regular.ttf"),
      "BebasNeue-Regular": require("../../assets/fonts/BebasNeue-Regular.ttf"),
      "Anton-Regular.ttf": require("../../assets/fonts/Anton-Regular.ttf"),
      "Oswald-VariableFont_wght": require("../../assets/fonts/Oswald-VariableFont_wght.ttf"),
    });
    //this.setState({ fontLoaded: true });
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
      this._clearCartOptimized();
      this.setState({ fontLoaded: true });
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    this.focusListener.remove();
    this._isMounted = false;
  }

  handleBackButton = () => {
    alert(
      "Press the OKAY button at the bottom of the screen to return to WHICHQ home page"
    );
    return true;
  };

  _clearCartOptimized = () => {
    let itemsOnCart = this.state.products;
    let userID = firebase.auth().currentUser.uid;
    let storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    itemsOnCart.forEach((item) => {
      console.log("starting");
      if (item.subCatagory !== "NotModal") {
        let itemReference = `STORES/${storeLocator}/ITEMS DATABASE/${item.productCatagory}/PRODUCTS/${item.productDecription}/SIMILAR ITEMS/${item.subCatagory}/onCart/${userID}`;
        firebase.database().ref(itemReference).remove();
        //console.log(itemReference);
      } else {
        let itemReference = `STORES/${storeLocator}/ITEMS DATABASE/${item.productCatagory}/PRODUCTS/${item.productDecription}/onCart/${userID}`;
        firebase.database().ref(itemReference).remove();
        //console.log(itemReference);
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

    this.setState({ fontLoaded: false });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.fontLoaded ? (
          <View
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <View
              style={{
                height: "6%",
                width: "100%",
                backgroundColor: "#ed0971",
                //alignContent: 'center',
                //justifyContent: "space-between",
                flexDirection: "row",
                //paddingHorizontal: one * 10,
              }}
            >
              <View
                style={{
                  height: screenHeight * 0.06,
                  width: "100%",
                  alignContent: "center",
                  justifyContent: "center",
                  //backgroundColor: "blue",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: one * 20,
                    fontWeight: "bold",
                    marginTop: one * 3,
                    alignSelf: "center",
                  }}
                >
                  ORDER ACCEPTED
                </Text>
              </View>
            </View>
            <View
              style={{
                height: "86%",
                width: "98%",
                backgroundColor: "white",
                alignSelf: "center",
                marginBottom: "1%",
              }}
            >
              <View
                style={{
                  height: "25%",
                  width: "100%",
                  alignSelf: "center",
                  paddingHorizontal: one * 5,
                  //paddingTop: "1%",
                  alignContent: "center",
                  //backgroundColor: "blue",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: one * 21,
                    fontFamily: "Oswald-VariableFont_wght",
                    marginLeft: "1%",
                  }}
                >
                  💃Yeeeh! {this.state.StoreName}, {this.state.StoreLocation}{" "}
                  has accepted your order and will be expecting you around{" "}
                  {this.state.collectionTime} | {this.state.collectionDate}
                </Text>
              </View>
              <View
                style={{
                  height: "7.5%",
                  width: "100%",
                  backgroundColor: "pink",
                  alignItems: "center",
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    //backgroundColor: "pink",
                    height: "100%",
                    width: "67%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      marginLeft: "5%",
                    }}
                  >
                    Product Name
                  </Text>
                </View>
                <View
                  style={{
                    //backgroundColor: "green",
                    height: "100%",
                    width: "9%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    Qty
                  </Text>
                </View>
                <View
                  style={{
                    //backgroundColor: "black",
                    height: "100%",
                    width: "24%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      //alignSelf: "center",
                    }}
                  >
                    Price
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: "60.5%",
                  width: "87%",
                  alignItems: "center",
                  alignSelf: "center",
                  //backgroundColor: "#ff87c1",
                }}
              >
                <FlatList
                  data={this.state.products}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          height: screenHeight * 0.055,
                          width: "100%",
                          marginVertical: one * 2,
                          flexDirection: "row",
                          alignSelf: "center",
                          backgroundColor: "white",
                          elevation: one * 2,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            height: "100%",
                            width: "70%",
                            paddingLeft: one * 3,
                          }}
                        >
                          <View
                            style={{
                              flexGrow: 1,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              numberOfLines={2}
                              style={{
                                color: "black",
                                fontSize: one * 15,
                                fontWeight: "bold",
                                alignSelf: "flex-start",
                              }}
                            >
                              {item.productDecription}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            //backgroundColor: "red",
                            height: "100%",
                            width: "9%",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "black",
                              fontSize: one * 15,
                              fontWeight: "bold",
                              alignSelf: "center",
                            }}
                          >
                            {item.Quantity}
                          </Text>
                        </View>
                        <View
                          style={{
                            //backgroundColor: "green",
                            height: "100%",
                            width: "20%",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "black",
                              fontSize: one * 15,
                              fontWeight: "bold",
                              alignSelf: "center",
                            }}
                          >
                            R{item.productSubTotal.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
              <View
                style={{
                  height: "7.5%",
                  width: "100%",
                  backgroundColor: "pink",
                  alignItems: "center",
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    //backgroundColor: "pink",
                    height: "100%",
                    width: "67%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      marginLeft: "10%",
                    }}
                  >
                    Service fee:
                  </Text>
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      marginLeft: "10%",
                    }}
                  >
                    TOTAL:
                  </Text>
                </View>
                <View
                  style={{
                    //backgroundColor: "pink",
                    height: "100%",
                    width: "9%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    -
                  </Text>
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    {this.state.noItems}
                  </Text>
                </View>
                <View
                  style={{
                    // backgroundColor: "pink",
                    height: "100%",
                    width: "24%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      //alignSelf: "center",
                    }}
                  >
                    R15.00
                  </Text>
                  <Text
                    style={{
                      color: "#c20e44",
                      fontSize: one * 15,
                      fontWeight: "bold",
                      //alignSelf: "center",
                    }}
                  >
                    R{this.state.balance}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                height: "7%",
                width: "100%",
                //backgroundColor: "red",
              }}
            >
              <Button
                style={{ fontSize: 20, color: "white" }}
                containerStyle={{
                  height: "95%",
                  borderRadius: 5,
                  width: "97%",
                  backgroundColor: "red",
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: "0.2%",
                }}
                onPress={() => this.props.navigation.navigate("RoyalCafe")}
              >
                OKAY
              </Button>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="red" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3dadd",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  orderInfoText: {
    color: "black",
    fontSize: one * 21,
    fontFamily: "Oswald-VariableFont_wght",
  },
});
