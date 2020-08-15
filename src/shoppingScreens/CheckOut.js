import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  //Modal,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Platform,
  BackHandler,
  FlatList,
} from "react-native";
import Modal from "react-native-modalbox";
import firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "react-native-button";
import { WebView } from "react-native-webview";
import * as Font from "expo-font";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import DropDown from "../checkOutComponents/DropDown";
import MyButton from "../checkOutComponents/MyButton";
import DropDownTime from "../checkOutComponents/DropDownTime";
import MyButtonTime from "../checkOutComponents/MyButtonTime";

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class CheckOut extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      ref: "0000",
      balance: this.props.navigation.state.params.balance,
      products: this.props.navigation.state.params.products,
      noItems: this.props.navigation.state.params.noItems,
      StoreName: this.props.navigation.state.params.StoreName,
      StoreLocation: this.props.navigation.state.params.StoreLocation,
      USDZAR: 0.0696518,
      show: false,
      showTime: false,
      position: {},
      collectionDate: "Today",
      collectionTime: "16:30 - 17:00",
      fontLoaded: false,
      date: null,
      isPaying: false,
      timeSlots: null,
      changeTimeModalHeight: 200,
      total:
        parseFloat(this.props.navigation.state.params.balance) +
        parseFloat(15.0),
    };
    this.webView = null;
  }

  async componentDidMount() {
    this._isMounted = true;
    await Font.loadAsync({
      "LibreBaskerville-Bold": require("../../assets/fonts/LibreBaskerville-Bold.ttf"),
      "LibreBaskerville-Italic": require("../../assets/fonts/LibreBaskerville-Italic.ttf"),
      "LibreBaskerville-Regular": require("../../assets/fonts/LibreBaskerville-Regular.ttf"),
      "BebasNeue-Regular": require("../../assets/fonts/BebasNeue-Regular.ttf"),
      "Anton-Regular.ttf": require("../../assets/fonts/Anton-Regular.ttf"),
      "Oswald-VariableFont_wght": require("../../assets/fonts/Oswald-VariableFont_wght.ttf"),
    });
    this.setState({ fontLoaded: true });
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    });

    const time = new Date();
    let hourNow = time.getHours();
    let defaultCollectionTime = `${hourNow + 1}:30 -${hourNow + 2}:00 `;
    this.setState({ collectionTime: defaultCollectionTime });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    this.focusListener.remove();
    this._isMounted = false;
  }

  handleBackButton = () => {
    if (this.state.isPaying === true) {
      this.refs.payModal.close();
      this.setState({ isPaying: false });
      return true;
    } else if (this.state.isPickingDate === true) {
      this.refs.datePicker.close();
      return true;
    }
  };
  paymentDone = () => {
    this.props.navigation.navigate("orderSuccessful", {
      products: this.state.products,
      balance: this.state.total.toFixed(2),
      noItems: this.state.noItems,
      StoreName: this.state.StoreName,
      StoreLocation: this.state.StoreLocation,
      collectionDate: this.state.collectionDate,
      collectionTime: this.state.collectionTime,
    });
  };

  onMessage(event) {
    alert("Incoming message");
    console.log("On Message", event.nativeEvent.data);
  }

  loaded = () => {
    alert("Sending post message working");
  };

  sendPostMessage = () => {
    let currentPrice = parseFloat(this.state.USDZAR);
    let cartPrice = parseFloat(this.state.total.toFixed(2));
    let priceToPay = parseFloat(cartPrice) * parseFloat(currentPrice);
    this.webView.postMessage(priceToPay.toFixed(2));
  };

  handleResponse = (data) => {
    if (data.title === "sucessful") {
      this.refs.payModal.close();
      this.paymentDone();
      console.log(data);
    } else if (data.title === "cancel") {
      this.setState({ showModal: false, ref: data.target });
    } else {
      return;
    }
  };

  // handle showing the dropdown
  showDropDown = () => {
    if (this.button) {
      // use the uimanager to measure the button's position in the window
      UIManager.measure(
        findNodeHandle(this.button),
        (x, y, width, height, pageX, pageY) => {
          const position = {
            left: pageX,
            top: pageY,
            width: width,
            height: height,
          };
          // setState, which updates the props that are passed to the DropDown component
          this.setState({
            show: true,
            position: { x: pageX + width / 2, y: pageY + (2 * height) / 3 },
          });
        }
      );
    }
  };

  showDropDownTime = () => {
    if (this.buttonTime) {
      // use the uimanager to measure the buttonTime's position in the window
      UIManager.measure(
        findNodeHandle(this.buttonTime),
        (x, y, width, height, pageX, pageY) => {
          const position = {
            left: pageX,
            top: pageY,
            width: width,
            height: height,
          };
          // setState, which updates the props that are passed to the DropDown component
          this.setState({
            showTime: true,
            position: { x: pageX + width / 2, y: pageY + (2 * height) / 3 },
          });
        }
      );
    }
  };

  // hide the dropdown
  hideDropDown = (item) => {
    this.setState({
      show: false,
      position: {},
    });

    if (item === "Pick date") {
      this.refs.datePicker.open();
    } else {
      this.setState({ collectionDate: item });
    }
  };
  hideDropDownTime = (item) => {
    //alert(item);
    this.setState({
      showTime: false,
      position: {},
      collectionTime: item,
    });
  };
  canceled = (item) => {
    //alert(item);
    this.setState({ show: false, position: {} });
  };
  canceledTime = (item) => {
    //alert(item);
    this.setState({ showTime: false, position: {} });
  };

  changeTimeModal = () => {
    const timeSlots = [];

    //open time
    let openHour = "7";
    let openMinute = "30";
    let openTime = `${openHour}:${openMinute}`;

    //close time
    let closeHour = "23";
    let closeMinute = "00";
    let closeTime = `${closeHour}:${closeMinute}`;

    //Store's operating hours
    let workingHours = `${openTime}-${closeTime}`;

    //current time
    const time = new Date();
    let hourNow = time.getHours();
    let minuteNow = time.getMinutes();
    let currentTime = `${hourNow}:${minuteNow}`;

    // && minuteNow > openMinute

    if (hourNow > openHour) {
      var colors = ["red", "blue", "green"];
      for (let i = hourNow; i < closeHour; i++) {
        //First window
        let slot1 = `${i}:00`;
        let slot2 = `${i}:30`;
        let firstWindow = `${slot1} - ${slot2}`;

        //Second window
        let slotA = slot2;
        let slotB = `${i + 1}:00`;
        let secondWindow = `${slotA} - ${slotB}`;

        timeSlots.push({
          timeSlot: firstWindow,
        });
        timeSlots.push({
          timeSlot: secondWindow,
        });
        //console.log(timeSlots);
      }
      // console.log(`Time now is:${currentTime} `);
      // console.log(`workingHours are: ${workingHours}`);
    } else {
      console.log("Time has passed");
    }
    this.setState({ timeSlots: timeSlots });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.fontLoaded ? (
          <View style={{ height: "100%", width: "100%", alignSelf: "center" }}>
            <View
              style={{
                height: "6%",
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#ed0971",
                alignContent: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                //paddingHorizontal: one * 10,
              }}
            >
              <TouchableOpacity
                style={{
                  //backgroundColor: "red",
                  width: "10%",
                }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon
                  name="md-arrow-back"
                  color={"white"}
                  size={one * 35}
                  style={{
                    alignSelf: "center",
                    marginTop: one * 1,
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: screenHeight * 0.06,
                  width: "90%",
                  alignContent: "center",
                  justifyContent: "center",
                  //backgroundColor: "blue",
                  paddingRight: "10%",
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
                  Pick-Up Info
                </Text>
              </View>
            </View>

            <Modal
              ref={"payModal"}
              style={{
                width: screenWidth,
                height: screenHeight,
                backgroundColor: "#990849",
              }}
              backdrop={false}
              swipeToClose={false}
              useNativeDriver={true}
            >
              <WebView
                source={{
                  uri: "https://friendly-meninsky-ba45a8.netlify.app/",
                }}
                style={{ marginTop: 0.01 }}
                ref={(webView) => (this.webView = webView)}
                onMessage={this.onMessage}
                onLoad={this.sendPostMessage}
                onNavigationStateChange={(data) => this.handleResponse(data)}
              />
            </Modal>
            <View
              style={{
                height: "87%",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <Modal
                ref={"datePicker"}
                animationType="slide"
                transparent={true}
                position="center"
                backdrop={true}
                // onClosed={() => {}}
                style={{
                  justifyContent: "space-around",
                  borderRadius: Platform.OS === "ios" ? one * 30 : 0,
                  shadowRadius: one * 10,
                  width: screenWidth * 0.8,
                  height: one * 200,
                  backgroundColor: "#990849",
                  marginBottom: one * 20,
                }}
                onOpened={() => this.setState({ isPickingDate: true })}
                onClosed={() => this.setState({ isPickingDate: false })}
              >
                <Text
                  style={{
                    marginHorizontal: "5%",
                    marginTop: "10%",
                    alignSelf: "center",
                    color: "white",
                  }}
                >
                  If the date you pick is too far, some items may not be
                  available by then but you will be refunded for all items that
                  may be out of stock
                </Text>
                <DatePicker
                  showIcon={false}
                  androidMode="calendar"
                  style={{ width: 150, alignSelf: "center", marginTop: "3%" }}
                  date={this.state.date}
                  mode="date"
                  placeholder="Okay I understand"
                  format="DD-MM-YYYY"
                  minDate={moment().format("DD-MM-YYYY")}
                  maxDate="01-12-2020"
                  confirmBtnText="Chọn"
                  cancelBtnText="Hủy"
                  customStyles={{
                    dateInput: {
                      backgroundColor: "red",
                      borderWidth: 1,
                      borderColor: "black",
                      width: 10,
                    },
                  }}
                  onDateChange={(date) => {
                    this.setState({
                      collectionDate: date,
                    });
                    this.refs.datePicker.close();
                  }}
                />
              </Modal>
              <Modal
                ref={"changeTime"}
                //animationType="slide"
                transparent={true}
                position="center"
                backdrop={true}
                // onClosed={() => {}}
                style={{
                  justifyContent: "center",
                  borderRadius: Platform.OS === "ios" ? one * 30 : 0,
                  shadowRadius: one * 10,
                  width: 100,
                  height: one * this.state.changeTimeModalHeight,
                  backgroundColor: "white",
                  marginTop: 30,
                  marginLeft: 80,
                }}
                onOpened={() => this.setState({ isChangingTime: true })}
                onClosed={() => this.setState({ isChangingTime: false })}
              >
                <FlatList
                  keyExtractor={(item) => item.timeSlot}
                  data={this.state.timeSlots}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.setState({ collectionTime: item.timeSlot });
                          this.refs.changeTime.close();
                        }}
                      >
                        <Text>{item.timeSlot}</Text>
                      </TouchableOpacity>
                    );
                  }}
                ></FlatList>
              </Modal>
              <View
                style={{
                  height: "30%",
                  width: "97%",
                  //backgroundColor: "blue",
                  alignContent: "center",
                  //justifyContent: "space-around",
                  alignSelf: "center",
                  paddingHorizontal: one,
                }}
              >
                <Text
                  style={{
                    fontSize: one * 20,
                    fontFamily: "LibreBaskerville-Italic",
                    fontWeight: "800",
                    alignSelf: "center",
                    marginTop: "4%",
                    //backgroundColor: "green",
                  }}
                >
                  {" "}
                  Your Order will be ready for
                </Text>
                <Text
                  style={{
                    fontSize: one * 20,
                    fontFamily: "LibreBaskerville-Italic",
                    fontWeight: "800",
                    alignSelf: "center",
                    //marginLeft: "7%",
                    //backgroundColor: "green",
                  }}
                >
                  collection at: {this.state.StoreName},{" "}
                  {this.state.StoreLocation}.
                </Text>
                <Text
                  style={{
                    fontSize: one * 20,
                    fontFamily: "LibreBaskerville-Italic",
                    fontWeight: "800",
                    alignSelf: "center",
                    marginTop: "2%",
                    // backgroundColor: "green",
                  }}
                >
                  {" "}
                  When do you want to collect it?
                </Text>
                <View
                  style={{
                    height: "40%",
                    width: "100%",
                    //backgroundColor: "red",
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                    marginTop: "1%",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: "48%",
                      //backgroundColor: "red",
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "space-around",
                      //lexDirection: "row",
                      //paddingHorizontal: "10%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: one * 20,
                        fontFamily: "LibreBaskerville-Bold",
                        //fontWeight: "bold",
                        alignSelf: "center",
                        //marginLeft: "5%",
                      }}
                    >
                      DATE:
                    </Text>
                    <Text
                      style={{
                        fontSize: one * 20,
                        fontWeight: "bold",
                        alignSelf: "center",
                        //marginLeft: "5%",
                      }}
                    >
                      {this.state.collectionDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: "100%",
                      width: "48%",
                      //backgroundColor: "blue",
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: one * 20,
                        fontFamily: "LibreBaskerville-Bold",
                        alignSelf: "center",
                        //marginLeft: "5%",
                      }}
                    >
                      TIME SLOT:
                    </Text>
                    <Text
                      style={{
                        fontSize: one * 20,
                        fontWeight: "bold",
                        alignSelf: "center",
                        //marginLeft: "5%",
                      }}
                    >
                      {this.state.collectionTime}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: "8%",
                  width: "97%",
                  backgroundColor: "white",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  //paddingHorizontal: "10%",
                }}
              >
                <MyButton
                  ref={(ref) => {
                    this.button = ref;
                  }}
                  onPress={this.showDropDown}
                  title={"Change Date"}
                />
                <MyButtonTime
                  ref={(ref) => {
                    this.buttonTime = ref;
                  }}
                  onPress={() => {
                    this.changeTimeModal();
                    this.refs.changeTime.open();
                  }}
                  title={"Change Time"}
                />
              </View>
              <View
                style={{
                  height: "62%",
                  width: "97%",
                  backgroundColor: "white",
                  alignItems: "center",
                  alignSelf: "center",
                  paddingTop: one * 10,
                }}
              >
                <View
                  style={{
                    height: "10%",
                    width: "97%",
                    //backgroundColor: "#036b37",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: one * 20,
                      //fontWeight: "bold",
                      color: "black",
                      fontFamily: "LibreBaskerville-Bold",
                    }}
                  >
                    Your Order Number is 250
                  </Text>
                </View>
                <ImageBackground
                  source={{
                    uri:
                      "https://firebasestorage.googleapis.com/v0/b/whichq-firebase.appspot.com/o/App%20Asserts%2Fbarcode.png?alt=media&token=b8b3f477-e1f7-4e32-8ac3-c55ec00ec1c1",
                  }}
                  resizeMode="contain"
                  imageStyle={{ opacity: 0.9, borderRadius: 1, borderWidth: 1 }}
                  style={{
                    width: "100%",
                    height: "80%",
                    justifyContent: "flex-end",
                    //alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: "10%",
                      width: "97%",
                      //backgroundColor: "#036b37",
                      alignItems: "center",
                      justifyContent: "center",
                      //alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: one * 18,
                        //fontWeight: "bold",
                        color: "black",
                        fontFamily: "LibreBaskerville-Bold",
                      }}
                    >
                      Items purchased: R{this.state.balance}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: "10%",
                      width: "97%",
                      //backgroundColor: "#036b37",
                      alignItems: "center",
                      justifyContent: "center",
                      //alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: one * 18,
                        //fontWeight: "bold",
                        color: "black",
                        fontFamily: "LibreBaskerville-Bold",
                      }}
                    >
                      Service fee: R15
                    </Text>
                  </View>
                </ImageBackground>
                <View
                  style={{
                    height: "10%",
                    width: "97%",
                    //backgroundColor: "#036b37",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: one * 23,
                      //fontWeight: "bold",
                      color: "black",
                      fontFamily: "LibreBaskerville-Bold",
                    }}
                  >
                    Total: R{this.state.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            <DropDown
              show={this.state.show}
              position={this.state.position}
              hide={this.hideDropDown}
              clear={this.canceled}
            />
            <DropDownTime
              show={this.state.showTime}
              position={this.state.position}
              hide={this.hideDropDownTime}
              clear={this.canceledTime}
            />

            <View
              style={{
                height: "7%",
                width: "100%",
                backgroundColor: "white",
                alignSelf: "center",
              }}
            >
              <Button
                style={{ fontSize: one * 23, color: "white" }}
                containerStyle={{
                  height: "95%",
                  borderRadius: 5,
                  width: "97%",
                  backgroundColor: "#c9321a",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.refs.payModal.open();
                  this.setState({ isPaying: true });
                  //console.log(this.state.products);
                }}
              >
                Pay Now
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
});

//Functionality for node based paypal beckend on folder "Paypal". I saved the modal and it's button to launch it 01/08/2020

{
  /* <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
        >
          <WebView
            source={{ uri: "http://192.168.0.182:1996" }}
            //injectedJavaScript={`document.f1.submit()`}
            injectedJavaScript={`
            document.getElementsByName("price")[0].value=${this.state.balance}
            setTimeout(() => {
              document.f1.submit()
            }, 1000);
            `}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={this.onMessage}
            //onLoadEnd={console.log('Working Too')}
            //injectJavaScript={`document.f1.submit()`}
            onNavigationStateChange={(data) => this.handleResponse(data)}
            style={{ marginTop: 0.01 }}
          />
        </Modal> */
}

{
  /* <Button
          style={{ fontSize: 18, color: "blue" }}
          onPress={() => this.setState({ showModal: true })}
        >
          Pay With PayPal
        </Button> */
}
