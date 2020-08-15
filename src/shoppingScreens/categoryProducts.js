import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Vibration,
  TouchableHighlight,
  ScrollView,
  BackHandler,
} from "react-native";
import firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modalbox";
import { AntDesign, Foundation, Entypo, Feather } from "@expo/vector-icons";

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class categoryProducts extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      currentCategory: this.props.navigation.state.params.selectedCategory,
      StoreName: this.props.navigation.state.params.StoreName,
      StoreLocation: this.props.navigation.state.params.StoreLocation,
      noItems: 0,
      balance: 0,
      modalIsOpen: false,
      isFetching: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      if (this._isMounted) {
        firebase
          .database()
          .ref(
            `STORES/${this.state.StoreName} (${this.state.StoreLocation})/ITEMS DATABASE/`
          )
          .on("value", (snapshot) => {
            const StoreShelvesTop = [];
            snapshot.forEach((doc) => {
              let itemCategory = doc.toJSON().CategoryName;
              if (itemCategory == this.state.currentCategory) {
                StoreShelvesTop.push({
                  key: doc.key,
                  CategoryName: itemCategory,
                  backgroundColor: "#ed0971",
                });
              } else {
                StoreShelvesTop.push({
                  key: doc.key,
                  CategoryName: itemCategory,
                  backgroundColor: "#990849",
                });
              }

              this.setState({
                StoreShelvesTop: StoreShelvesTop.sort((a, b) => {
                  return a.CategoryName < b.CategoryName;
                }),
              });
            });
          });
        this.loadData();
      }
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    });
    this.focusListener = navigation.addListener("didBlur", () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        this.handleBackButton
      );
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    this.focusListener.remove();
  }

  handleBackButton = () => {
    if (this.state.modalIsOpen === true) {
      this.refs.moreItemsModal.close();
      return true;
    }
  };

  render() {
    const NoCartView = (
      <View
        style={{
          height: "7%",
          width: "100%",
          backgroundColor: "#ed0971",
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
        }}
      >
        <View
          style={{
            height: screenHeight * 0.07,
            width: "25%",
            flexDirection: "row",
            paddingLeft: one * 10,
          }}
        >
          <Icon
            name="md-cart"
            style={{
              color: "white",
              //marginTop: one*12,
              alignSelf: "center",
              marginLeft: one,
            }}
            size={one * 20}
          />
          <Text
            style={{
              color: "white",
              fontSize: one * 17,
              fontWeight: "bold",
              alignSelf: "center",
              marginLeft: one * 4,
            }}
          >
            {this.state.noItems}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("viewCart", {
              StoreName: this.state.StoreName,
              StoreLocation: this.state.StoreLocation,
            })
          }
          style={{
            height: "85%",
            width: "49%",
            backgroundColor: "red",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: one * 4,
            borderWidth: one,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: one * 20,
              fontWeight: "bold",
              alignSelf: "center",
              marginLeft: one * 2,
            }}
          >
            View Cart
          </Text>
        </TouchableOpacity>
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
        >
          <Text
            style={{
              color: "white",
              fontSize: one * 16,
              fontWeight: "bold",
              alignSelf: "center",
              //alignSelf: 'center'
            }}
          >
            R {this.state.balance}
          </Text>
        </View>
      </View>
    );

    let shopPaddingBottom;
    let ShoppingCart;
    if (this.state.noItems !== 0) {
      ShoppingCart = NoCartView;
      shopPaddingBottom = one * 86;
    } else {
      ShoppingCart = (
        <View
          style={{ height: screenHeight * 0.001, alignSelf: "flex-end" }}
        ></View>
      );
      shopPaddingBottom = one * 43;
    }

    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            width: "5%",
            height: "5%",
            flex: 1,
          }}
        >
          {this.state.isFetching ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <View />
          )}
        </View>
        <View
          style={{
            height: screenHeight * 0.06,
            width: "100%",
            backgroundColor: "#ed0971",
            //alignContent: 'center',
            //justifyContent: 'center',
            flexDirection: "row",
            paddingHorizontal: one * 10,
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon
              name="md-arrow-back"
              color={"white"}
              size={one * 35}
              style={{
                //alignSelf: 'flex-start',
                marginTop: one * 1,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              height: screenHeight * 0.06,
              width: "90%",
              //backgroundColor: '#f28dbf',
              alignContent: "center",
              justifyContent: "center",
              //flexDirection: 'row',
              //paddingHorizontal: one*10
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: one * 20,
                fontWeight: "bold",
                //marginLeft: screenWidth*0.25,
                marginTop: one * 2,
                alignSelf: "center",
              }}
            >
              {this.state.currentCategory}
            </Text>
          </View>
        </View>
        <Modal
          ref={"moreItemsModal"}
          style={{
            borderRadius: Platform.OS === "ios" ? one * 30 : 0,
            shadowRadius: one * 10,
            width: screen.width - one * 3,
            height: screenHeight * 0.83,
            backgroundColor: "#e3dadd",
            marginBottom: one * 20,
          }}
          position="center"
          backdrop={true}
          onClosed={() => {
            this.setState({
              modalIsOpen: false,
            });
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#e3dadd",
              marginTop: one * 5,
              marginLeft: one * 4,
              paddingRight: one * 5,
            }}
          >
            <FlatList
              numColumns={2}
              data={this.state.products}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      height: screenHeight * 0.4,
                      width: screenWidth * 0.48,
                      marginBottom: one,
                      marginHorizontal: one * 2,
                      marginVertical: one * 2,
                    }}
                  >
                    <TouchableHighlight
                      style={{
                        flex: 2,
                        justifyContent: "center",
                        alignContent: "flex-start",
                        height: screenHeight * 0.36,
                        width: "100%",
                        backgroundColor: "white",
                      }}
                    >
                      <Image
                        source={{ uri: item.productImage }}
                        style={{
                          height: screenHeight * 0.25,
                          width: "98%",
                          //alignSelf: 'center',
                        }}
                        resizeMode="contain"
                      ></Image>
                    </TouchableHighlight>
                    <View
                      style={{
                        backgroundColor: "white",
                        height: "35%",
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          height: "58%",
                          width: "100%",
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: screenWidth * 0.21,
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#0d0a2b",
                              fontSize: one * 16,
                              fontWeight: "900",
                              borderWidth: one,
                              borderColor: "#ffbad1",
                              backgroundColor: "#ffbad1",
                              borderRadius: one * 2,
                              height: "60%",
                            }}
                          >
                            R{item.productPrice}
                          </Text>
                        </View>

                        <View
                          style={{
                            height: "100%",
                            width: "52%",
                            backgroundColor: "white",
                            padding: one * 2,
                          }}
                        >
                          <ScrollView>
                            <Text
                              //numberOfLines={2}
                              style={{
                                color: "black",
                                fontSize: one * 13,
                                fontWeight: "bold",
                              }}
                            >
                              {item.productDecription}
                            </Text>
                          </ScrollView>
                        </View>
                      </View>
                      <View
                        style={{
                          height: "40%",
                          width: "100%",
                          backgroundColor: "white",
                          alignContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {item.bgColor === "green" ? (
                          <View
                            style={{
                              height: "100%",
                              width: "60%",
                              //backgroundColor: "#ed0971",
                              justifyContent: "center",
                              flexDirection: "row",
                              marginLeft: one * 2,
                              paddingTop: one * 5,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                this.onPressMinusModal(
                                  item.productDecription,
                                  item.productPrice,
                                  item.Quantity,
                                  item.subCatagory
                                );
                              }}
                              style={{
                                height: "100%",
                                width: "33.33%",
                                alignSelf: "center",
                              }}
                            >
                              <Entypo
                                name="squared-minus"
                                size={one * 27}
                                color="red"
                                style={{ alignSelf: "center" }}
                              />
                            </TouchableOpacity>
                            <View
                              style={{
                                height: "100%",
                                width: "33.33%",
                                alignSelf: "center",
                                alignSelf: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "black",
                                  fontSize: one * 21,
                                  fontWeight: "bold",
                                  alignSelf: "center",
                                }}
                              >
                                {item.Quantity}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.onPressPlusModal(
                                  item.productDecription,
                                  item.productPrice,
                                  item.Quantity,
                                  item.subCatagory
                                );
                              }}
                              style={{
                                height: "100%",
                                width: "33.33%",
                                alignSelf: "center",
                              }}
                            >
                              <AntDesign
                                name="plussquare"
                                size={one * 27}
                                color="green"
                                style={{ alignSelf: "center" }}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              this.onPressAddToCartModal(
                                item.productDecription,
                                item.productPrice,
                                item.productImage,
                                item.productCatagory,
                                item.Quantity,
                                item.subCatagory
                              )
                            }
                            style={{
                              height: "100%",
                              width: "60%",
                              backgroundColor: "#ed0971",
                              alignItems: "flex-start",
                              justifyContent: "center",
                              flexDirection: "row",
                              marginLeft: one * 2,
                            }}
                          >
                            <Icon
                              name="md-cart"
                              style={{ color: "white", marginTop: one * 5 }}
                              size={one * 22}
                            />
                            <Text
                              style={{
                                color: "white",
                                fontSize: one * 12,
                                fontWeight: "bold",
                                alignSelf: "center",
                              }}
                            >
                              ADD TO CART
                            </Text>
                          </TouchableOpacity>
                        )}
                        {item.favourateIconName === "md-star-outline" ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.onPressRemoveFavourateModal(
                                item.productDecription,
                                item.subCatagory
                              );
                            }}
                            style={{
                              height: "96%",
                              width: "20%",
                              justifyContent: "center",
                              flexDirection: "row",
                              marginBottom: one * 3,
                            }}
                          >
                            <Icon
                              name="md-star"
                              color={"#851337"}
                              size={one * 32}
                              style={{
                                alignSelf: "center",
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              this.onPressAddFavourateModal(
                                item.productDecription,
                                item.productPrice,
                                item.productImage,
                                item.subCatagory
                              );
                            }}
                            style={{
                              height: "96%",
                              width: "20%",
                              justifyContent: "center",
                              flexDirection: "row",
                              marginBottom: one * 3,
                            }}
                          >
                            <Icon
                              name="md-star-outline"
                              color={"#851337"}
                              size={one * 32}
                              style={{
                                alignSelf: "center",
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}
            ></FlatList>
          </View>
        </Modal>
        <View
          style={{
            width: "100%",
            backgroundColor: "#e3dadd",
            marginTop: one * 5,
            marginLeft: one * 4,
            paddingRight: one * 5,
            paddingBottom: shopPaddingBottom,
          }}
        >
          <FlatList
            numColumns={2}
            data={this.state.groupedItemsProducts}
            refreshing={this.state.isFetching}
            onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    height: screenHeight * 0.4,
                    width: screenWidth * 0.48,
                    marginBottom: one,
                    marginHorizontal: one * 2,
                    marginVertical: one * 2,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      alignContent: "center",
                      height: screenHeight * 0.36,
                      width: "100%",
                      backgroundColor: "white",
                    }}
                  >
                    <Image
                      source={{ uri: item.productImage }}
                      style={{
                        height: screenHeight * 0.25,
                        width: "98%",
                        alignSelf: "center",
                      }}
                      resizeMode="contain"
                    ></Image>
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: "white",
                      height: "35%",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        height: "58%",
                        width: "100%",
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: screenWidth * 0.21,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            color: "#0d0a2b",
                            fontSize: one * 16,
                            fontWeight: "900",
                            borderWidth: one,
                            borderColor: "#ffbad1",
                            backgroundColor: "#ffbad1",
                            borderRadius: one * 2,
                            height: "60%",
                            alignSelf: "center",
                          }}
                        >
                          R{item.productPrice}
                        </Text>
                      </View>

                      <View
                        style={{
                          height: "100%",
                          width: "52%",
                          backgroundColor: "white",
                          padding: one * 2,
                        }}
                      >
                        <View>
                          <Text
                            numberOfLines={3}
                            style={{
                              color: "black",
                              fontSize: one * 13,
                              fontWeight: "600",
                            }}
                          >
                            {item.productDecription}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        height: "40%",
                        //alignSelf: 'center',
                        width: "100%",
                        backgroundColor: "white",
                        justifyContent: "center",
                        //alignItems: 'center',
                        flexDirection: "row",
                      }}
                    >
                      {item.bgColor === "red" ? (
                        <View
                          style={{
                            height: "100%",
                            width: "58%",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginLeft: one * 2,
                            paddingTop: one * 5,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.onPressMinus(
                                item.productDecription,
                                item.productPrice,
                                item.Quantity
                              );
                            }}
                            style={{
                              height: "100%",
                              width: "33.33%",
                              alignSelf: "center",
                            }}
                          >
                            <Entypo
                              name="squared-minus"
                              size={one * 27}
                              color="red"
                              style={{ alignSelf: "center" }}
                            />
                          </TouchableOpacity>
                          <View
                            style={{
                              height: "100%",
                              width: "33.33%",
                              alignSelf: "center",
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "black",
                                fontSize: one * 21,
                                fontWeight: "bold",
                                alignSelf: "center",
                              }}
                            >
                              {item.Quantity}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.onPressPlus(
                                item.productDecription,
                                item.productPrice,
                                item.Quantity
                              );
                            }}
                            style={{
                              height: "100%",
                              width: "33.33%",
                              alignSelf: "center",
                            }}
                          >
                            <AntDesign
                              name="plussquare"
                              size={one * 27}
                              color="green"
                              style={{ alignSelf: "center" }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.onPressAddToCart(
                              item.productDecription,
                              item.productPrice,
                              item.productImage,
                              item.productCatagory,
                              item.Quantity,
                              item.subCatagory
                            )
                          }
                          style={{
                            height: "100%",
                            width: "58%",
                            backgroundColor: "#ed0971",
                            //alignContent: 'center',
                            justifyContent: "center",
                            flexDirection: "row",
                            marginLeft: one * 2,
                          }}
                        >
                          <Icon
                            name="md-cart"
                            style={{ color: "white", marginTop: one * 5 }}
                            size={one * 22}
                          />
                          <Text
                            style={{
                              color: "white",
                              fontSize: one * 12,
                              fontWeight: "bold",
                              alignSelf: "center",
                            }}
                          >
                            ADD TO CART
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item.favourateIconName === "md-star-outline" ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.onPressRemoveFavourate(
                              item.productDecription,
                              item.productCatagory
                            );
                          }}
                          style={{
                            height: "96%",
                            width: "20%",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginBottom: one * 3,
                          }}
                        >
                          <Icon
                            name="md-star"
                            color={"#851337"}
                            size={28}
                            style={{
                              alignSelf: "center",
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.onPressAddFavourate(
                              item.productDecription,
                              item.productPrice,
                              item.productImage,
                              item.subCatagory
                            );
                          }}
                          style={{
                            height: "96%",
                            width: "20%",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginBottom: one * 3,
                          }}
                        >
                          <Icon
                            name="md-star-outline"
                            color={"#851337"}
                            size={28}
                            style={{
                              alignSelf: "center",
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() =>
                          this.onPressMoreItems(item.productDecription)
                        }
                        style={{
                          height: "100%",
                          width: "20%",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: "70%",
                            backgroundColor:
                              item.moreItensIcon ===
                              "https://cdn2.iconfinder.com/data/icons/toolbar-signs-2/512/list_text_document_book_schedule-512.png"
                                ? "red"
                                : "white",
                            alignSelf: "center",
                          }}
                        >
                          <Feather
                            name="more-vertical"
                            size={one * 28}
                            style={{
                              marginRight: one * 6,
                            }}
                            color="white"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          ></FlatList>
        </View>
        {ShoppingCart}
      </View>
    );
  }

  //Shopping Functions
  onPressAddToCart = (
    itemDescription,
    itemproductPrice,
    itemproductImage,
    productCatagory,
    passedQuantity,
    itemsubCatagory
  ) => {
    let _currentUserId = firebase.auth().currentUser.uid;

    var CurrentBalance = parseFloat(this.state.balance);
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = CurrentBalance + SelectedItemPrice;

    firebase
      .database()
      .ref(
        "Users/" +
          _currentUserId +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/" +
          "Balance"
      )
      .update({
        noItems: parseInt(this.state.noItems) + 1,
        Total: NewBalance.toFixed(2),
      });

    Vibration.vibrate(100);
    let _totalItemsPrice = SelectedItemPrice * parseFloat(passedQuantity);

    if (passedQuantity !== 0) {
      firebase
        .database()
        .ref(
          "STORES/" +
            this.state.StoreName +
            " (" +
            this.state.StoreLocation +
            ")/ITEMS DATABASE/" +
            productCatagory +
            "/PRODUCTS/" +
            itemDescription +
            "/onCart/" +
            _currentUserId
        )
        .update({
          userID: _currentUserId,
        });
      firebase
        .database()
        .ref(
          "STORES/" +
            this.state.StoreName +
            " (" +
            this.state.StoreLocation +
            ")/ITEMS DATABASE/" +
            productCatagory +
            "/PRODUCTS/" +
            itemDescription +
            "/onCart/" +
            _currentUserId +
            "/itemStatus/userStatus"
        )
        .update({
          Liked: "No",
          Quantity: parseInt(passedQuantity) + 1,
        });
      firebase
        .database()
        .ref(
          "Users/" +
            _currentUserId +
            "/Current_Cart/" +
            this.state.StoreName +
            " (" +
            this.state.StoreLocation +
            ")/SelectedItems/" +
            itemDescription
        )
        .update({
          Quantity: parseInt(passedQuantity) + 1,
          productPrice: SelectedItemPrice,
          productDecription: itemDescription,
          productImage: itemproductImage,
          productSubTotal:
            parseFloat(_totalItemsPrice.toFixed(2)) +
            parseFloat(SelectedItemPrice.toFixed(2)),
          productCatagory: productCatagory,
          subCatagory: itemsubCatagory,
        });
    } else {
      firebase
        .database()
        .ref(
          "STORES/" +
            this.state.StoreName +
            " (" +
            this.state.StoreLocation +
            ")/ITEMS DATABASE/" +
            productCatagory +
            "/PRODUCTS/" +
            itemDescription +
            "/onCart/" +
            _currentUserId
        )
        .update({
          userID: _currentUserId,
        });
      firebase
        .database()
        .ref(
          "STORES/" +
            this.state.StoreName +
            " (" +
            this.state.StoreLocation +
            ")/ITEMS DATABASE/" +
            productCatagory +
            "/PRODUCTS/" +
            itemDescription +
            "/onCart/" +
            _currentUserId +
            "/itemStatus/userStatus"
        )
        .update({
          Liked: "No",
          Quantity: "1",
        });

      firebase
        .database()
        .ref(
          "Users/" +
            _currentUserId +
            "/Current_Cart/" +
            this.state.StoreName +
            " (" +
            this.state.StoreLocation +
            ")/SelectedItems/" +
            itemDescription
        )
        .update({
          productPrice: SelectedItemPrice,
          productDecription: itemDescription,
          productImage: itemproductImage,
          Quantity: "1",
          productSubTotal: SelectedItemPrice,
          productCatagory: productCatagory,
          subCatagory: itemsubCatagory,
        });
    }

    this.loadData();

    ToastAndroid.showWithGravity(
      "R" + SelectedItemPrice + " " + itemDescription + " added to your cart",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };
  onPressAddFavourate = (
    itemDescription,
    itemproductPrice,
    itemproductImage,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Add  userID into the store database under the favourated item
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${this.state.currentCategory}/PRODUCTS/${itemDescription}/favourite/${_currentUserId}`;
    firebaseDatabase.ref(selectedItemRef).update({
      userID: _currentUserId,
    });

    //Add product info into the user's database under Favourites
    let addItemToUserCartRef = `Users/${_currentUserId}/Favourites/${storeLocator}/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).update({
      productPrice: itemproductPrice,
      productDecription: itemDescription,
      productImage: itemproductImage,
      productCatagory: this.state.currentCategory,
      subCatagory: itemsubCatagory,
    });

    Vibration.vibrate(150);
    this.loadData();
  };
  onPressRemoveFavourate = (itemDescription) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Remove  userID from the store database under the product's favourate list
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${this.state.currentCategory}/PRODUCTS/${itemDescription}/favourite`;
    firebaseDatabase.ref(selectedItemRef).remove();

    //Remove the product listing from the user's database under Favourites
    let addItemToUserCartRef = `Users/${_currentUserId}/Favourites/${storeLocator}/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).remove();

    Vibration.vibrate(150);
    this.loadData();
  };
  onPressPlus = (itemDescription, itemproductPrice, passedQuantity) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Calculate the new total and Quantity
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = parseFloat(this.state.balance) + SelectedItemPrice;
    let _totalItemsPrice = SelectedItemPrice * parseFloat(passedQuantity);
    let _newQuantity = parseInt(passedQuantity) + 1;

    Vibration.vibrate(50);

    //Update balance on user cart
    let updateBalanceRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/Balance`;
    firebaseDatabase.ref(updateBalanceRef).update({
      noItems: parseInt(this.state.noItems) + 1,
      Total: NewBalance.toFixed(2),
    });

    let addItemToUserCartRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/SelectedItems/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).update({
      Quantity: _newQuantity,
      productSubTotal:
        parseFloat(_totalItemsPrice.toFixed(2)) +
        parseFloat(SelectedItemPrice.toFixed(2)),
    });

    //Update Quantity under user's ID inside the store
    let updateQtyRef = `STORES/${storeLocator}/ITEMS DATABASE/${this.state.currentCategory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}/itemStatus/userStatus`;
    firebaseDatabase.ref(updateQtyRef).update({
      Quantity: _newQuantity,
    });
    this.loadData();
  };
  onPressMinus = (itemDescription, itemproductPrice, passedQuantity) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Calculate the new total and Quantity
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = parseFloat(this.state.balance) - SelectedItemPrice;
    let _totalItemsPrice = SelectedItemPrice * parseFloat(passedQuantity);

    Vibration.vibrate(100);

    let addItemToUserCartRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/SelectedItems/${itemDescription}`;
    let updateBalanceRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/Balance`;

    //Update overall balance on user cart in store
    firebaseDatabase.ref(updateBalanceRef).update({
      noItems: parseInt(this.state.noItems) - 1,
      Total: NewBalance.toFixed(2),
    });

    if (passedQuantity > 1) {
      let _newQuantity = parseInt(passedQuantity) - 1;

      //update individual items quantity and subtotal on user cart
      firebaseDatabase.ref(addItemToUserCartRef).update({
        Quantity: _newQuantity,
        productSubTotal:
          parseFloat(_totalItemsPrice.toFixed(2)) -
          parseFloat(SelectedItemPrice.toFixed(2)),
      });

      //Update Quantity under user's ID inside the store
      let updateQtyRef = `STORES/${storeLocator}/ITEMS DATABASE/${this.state.currentCategory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}/itemStatus/userStatus`;
      firebaseDatabase.ref(updateQtyRef).update({
        Quantity: _newQuantity,
      });
    } else {
      firebaseDatabase.ref(addItemToUserCartRef).remove();

      firebaseDatabase
        .ref(
          `STORES/${storeLocator}/ITEMS DATABASE/${this.state.currentCategory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}`
        )
        .remove();
    }
    this.loadData();
  };
  onPressMoreItems = (itemproductDecription) => {
    const itemproductCatagory = this.state.currentCategory;
    this.setState({
      ModalProductDecription: itemproductDecription,
      ModalProductCatagory: itemproductCatagory,
    });

    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    const products = [];
    firebase
      .database()
      .ref(
        "STORES/" +
          storeLocator +
          "/ITEMS DATABASE/" +
          itemproductCatagory +
          "/PRODUCTS/" +
          itemproductDecription +
          "/SIMILAR ITEMS/"
      )
      .once("value", (snapshot) => {
        snapshot.forEach((doc) => {
          let pKey = doc.key;
          let pImage = doc.toJSON().productImage;
          let pPrice = doc.toJSON().productPrice;
          let pDecription = doc.toJSON().productDecription;
          let pCatagory = itemproductCatagory;

          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                itemproductCatagory +
                "/PRODUCTS/" +
                itemproductDecription +
                "/SIMILAR ITEMS/" +
                doc.toJSON().productDecription +
                "/onCart/"
            )
            .once("value", (snapshot) => {
              const onCartUsers = [];
              snapshot.forEach((doc) => {
                onCartUsers.push(doc.toJSON().userID);
              });

              var user_AddedIt_OnCart = onCartUsers.includes(
                firebase.auth().currentUser.uid
              );

              //C. Let's evaluate if the user favourated this item or not and define the icon name accordingly
              let favouriteRef = `STORES/${storeLocator}/ITEMS DATABASE/${itemproductCatagory}/PRODUCTS/${itemproductDecription}/SIMILAR ITEMS/${
                doc.toJSON().productDecription
              }/favourite`;
              let favourateIconName;
              firebaseDatabase.ref(favouriteRef).on("value", (snapshot) => {
                const favouriteUsers = [];
                snapshot.forEach((doc) => {
                  favouriteUsers.push(doc.toJSON().userID);
                });

                var user_Favourated_It = favouriteUsers.includes(currentUserId);

                if (user_Favourated_It === true) {
                  favourateIconName = "md-star-outline";
                } else {
                  favourateIconName = "md-star";
                }
              });

              if (user_AddedIt_OnCart === true) {
                firebase
                  .database()
                  .ref(
                    "STORES/" +
                      storeLocator +
                      "/ITEMS DATABASE/" +
                      itemproductCatagory +
                      "/PRODUCTS/" +
                      itemproductDecription +
                      "/SIMILAR ITEMS/" +
                      pDecription +
                      "/onCart/" +
                      firebase.auth().currentUser.uid +
                      "/itemStatus"
                  )
                  .once("value", (snapshot) => {
                    snapshot.forEach((doc) => {
                      products.push({
                        key: pKey,
                        productImage: pImage,
                        productPrice: pPrice,
                        productDecription: pDecription,
                        productCatagory: pCatagory,
                        Quantity: doc.toJSON().Quantity,
                        subCatagory: itemproductDecription,
                        bgColor: "green",
                        favourateIconName: favourateIconName,
                      });
                    });
                  });
              } else {
                products.push({
                  key: pKey,
                  productImage: pImage,
                  productPrice: pPrice,
                  productDecription: pDecription,
                  productCatagory: pCatagory,
                  subCatagory: itemproductDecription,
                  Quantity: "0",
                  bgColor: "white",
                  favourateIconName: favourateIconName,
                });
              }
            });
        });
        this.setState({
          products: products.sort((a, b) => {
            return a.productPrice > b.productPrice;
          }),
        });
      });

    if (!products.length) {
      return;
    } else {
      this.refs.moreItemsModal.open();
      this.setState({
        modalIsOpen: true,
      });
    }
  };

  //Functions that applies to the ModalBox Only
  onPressAddToCartModal = (
    itemDescription,
    itemproductPrice,
    itemproductImage,
    productCatagory,
    passedQuantity,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Calculate the new total
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = parseFloat(this.state.balance) + SelectedItemPrice;
    let _totalItemsPrice = SelectedItemPrice * parseFloat(passedQuantity);

    let updateBalanceRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/Balance`;
    firebaseDatabase.ref(updateBalanceRef).update({
      noItems: parseInt(this.state.noItems) + 1,
      Total: NewBalance.toFixed(2),
    });

    Vibration.vibrate(100);

    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemsubCatagory}/SIMILAR ITEMS/${itemDescription}/onCart/${_currentUserId}`;
    firebaseDatabase.ref(selectedItemRef).update({
      userID: _currentUserId,
    });

    let updateQtyRef = `${selectedItemRef}/itemStatus/userStatus`;
    firebaseDatabase.ref(updateQtyRef).update({
      Quantity: "1",
    });

    //Add passed and calculated info into the user's database
    let addItemToUserCartRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/SelectedItems/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).update({
      Quantity: "1",
      productPrice: SelectedItemPrice,
      productDecription: itemDescription,
      productImage: itemproductImage,
      productSubTotal: parseFloat(SelectedItemPrice.toFixed(2)),
      productCatagory: productCatagory,
      subCatagory: itemsubCatagory,
    });
    firebase
      .database()
      .ref(
        "Users/" +
          _currentUserId +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/ModalRefs/" +
          itemDescription
      )
      .update({
        deletingRef:
          "STORES/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/ITEMS DATABASE/" +
          productCatagory +
          "/PRODUCTS/" +
          itemsubCatagory +
          "/SIMILAR ITEMS/" +
          itemDescription +
          "/onCart/" +
          _currentUserId,
      });

    ToastAndroid.showWithGravity(
      `R${SelectedItemPrice} R${itemDescription} added to your cart`,
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );

    this.reloadModalData();
  };
  onPressAddFavourateModal = (
    itemDescription,
    itemproductPrice,
    itemproductImage,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    const productCatagory = this.state.currentCategory;

    //Add  userID into the store database under the favourated item
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemsubCatagory}/SIMILAR ITEMS/${itemDescription}/favourite/${_currentUserId}`;
    firebaseDatabase.ref(selectedItemRef).update({
      userID: _currentUserId,
    });

    //Add product info into the user's database under Favourites
    let addItemToUserCartRef = `Users/${_currentUserId}/Favourites/${storeLocator}/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).update({
      productPrice: itemproductPrice,
      productDecription: itemDescription,
      productImage: itemproductImage,
      productCatagory: productCatagory,
      subCatagory: itemsubCatagory,
    });

    Vibration.vibrate(150);
    this.reloadModalData();
  };
  onPressRemoveFavourateModal = (itemDescription, itemsubCatagory) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    const productCatagory = this.state.currentCategory;

    //Remove  userID from the store database under the product's favourate list
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemsubCatagory}/SIMILAR ITEMS/${itemDescription}/favourite`;
    firebaseDatabase.ref(selectedItemRef).remove();

    //Remove the product listing from the user's database under Favourites
    let addItemToUserCartRef = `Users/${_currentUserId}/Favourites/${storeLocator}/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).remove();

    Vibration.vibrate(150);
    this.reloadModalData();
  };
  onPressPlusModal = (
    itemDescription,
    itemproductPrice,
    passedQuantity,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    const productCatagory = this.state.currentCategory;

    //Calculate the new total and Quantity
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = parseFloat(this.state.balance) + SelectedItemPrice;
    let _totalItemsPrice = SelectedItemPrice * parseFloat(passedQuantity);
    let _newQuantity = parseInt(passedQuantity) + 1;

    Vibration.vibrate(100);

    //Update overall balance on user cart in store
    let updateBalanceRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/Balance`;
    firebaseDatabase.ref(updateBalanceRef).update({
      noItems: parseInt(this.state.noItems) + 1,
      Total: NewBalance.toFixed(2),
    });

    //update individual items quantity and subtotal
    let addItemToUserCartRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/SelectedItems/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).update({
      Quantity: _newQuantity,
      productSubTotal:
        parseFloat(_totalItemsPrice.toFixed(2)) +
        parseFloat(SelectedItemPrice.toFixed(2)),
    });

    //Update Quantity under user's ID inside the store
    let updateQtyRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemsubCatagory}/SIMILAR ITEMS/${itemDescription}/onCart/${_currentUserId}/itemStatus/userStatus`;
    firebaseDatabase.ref(updateQtyRef).update({
      Quantity: _newQuantity,
    });
    this.reloadModalData();
  };
  onPressMinusModal = (
    itemDescription,
    itemproductPrice,
    passedQuantity,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    const productCatagory = this.state.currentCategory;

    //Calculate the new total and Quantity
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = parseFloat(this.state.balance) - SelectedItemPrice;
    let _totalItemsPrice = SelectedItemPrice * parseFloat(passedQuantity);

    Vibration.vibrate(100);

    let addItemToUserCartRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/SelectedItems/${itemDescription}`;
    let updateBalanceRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/Balance`;

    //Update overall balance on user cart in store
    firebaseDatabase.ref(updateBalanceRef).update({
      noItems: parseInt(this.state.noItems) - 1,
      Total: NewBalance.toFixed(2),
    });

    if (passedQuantity > 1) {
      let _newQuantity = parseInt(passedQuantity) - 1;

      //update individual items quantity and subtotal on user cart
      firebaseDatabase.ref(addItemToUserCartRef).update({
        Quantity: _newQuantity,
        productSubTotal:
          parseFloat(_totalItemsPrice.toFixed(2)) -
          parseFloat(SelectedItemPrice.toFixed(2)),
      });

      //Update Quantity under user's ID inside the store
      let updateQtyRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemsubCatagory}/SIMILAR ITEMS/${itemDescription}/onCart/${_currentUserId}/itemStatus/userStatus`;
      firebaseDatabase.ref(updateQtyRef).update({
        Quantity: _newQuantity,
      });
    } else {
      firebaseDatabase.ref(addItemToUserCartRef).remove();

      firebaseDatabase
        .ref(
          `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemsubCatagory}/SIMILAR ITEMS/${itemDescription}/onCart/${_currentUserId}`
        )
        .remove();
    }
    this.reloadModalData();
  };
  reloadModalData = () => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    let itemproductDecription = this.state.ModalProductDecription;
    let itemproductCatagory = this.state.ModalProductCatagory;
    const products = [];
    firebase
      .database()
      .ref(
        "STORES/" +
          storeLocator +
          "/ITEMS DATABASE/" +
          itemproductCatagory +
          "/PRODUCTS/" +
          itemproductDecription +
          "/SIMILAR ITEMS/"
      )
      .once("value", (snapshot) => {
        snapshot.forEach((doc) => {
          let pKey = doc.key;
          let pImage = doc.toJSON().productImage;
          let pPrice = doc.toJSON().productPrice;
          let pDecription = doc.toJSON().productDecription;
          let pCatagory = itemproductCatagory;

          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                itemproductCatagory +
                "/PRODUCTS/" +
                itemproductDecription +
                "/SIMILAR ITEMS/" +
                doc.toJSON().productDecription +
                "/onCart/"
            )
            .once("value", (snapshot) => {
              const onCartUsers = [];
              snapshot.forEach((doc) => {
                onCartUsers.push(doc.toJSON().userID);
              });

              var user_AddedIt_OnCart = onCartUsers.includes(
                firebase.auth().currentUser.uid
              );

              //C. Let's evaluate if the user favourated this item or not and define the icon name accordingly
              let favouriteRef = `STORES/${storeLocator}/ITEMS DATABASE/${itemproductCatagory}/PRODUCTS/${itemproductDecription}/SIMILAR ITEMS/${
                doc.toJSON().productDecription
              }/favourite`;
              let favourateIconName;
              firebaseDatabase.ref(favouriteRef).on("value", (snapshot) => {
                const favouriteUsers = [];
                snapshot.forEach((doc) => {
                  favouriteUsers.push(doc.toJSON().userID);
                });

                var user_Favourated_It = favouriteUsers.includes(currentUserId);

                if (user_Favourated_It === true) {
                  favourateIconName = "md-star-outline";
                } else {
                  favourateIconName = "md-star";
                }
              });

              if (user_AddedIt_OnCart === true) {
                firebase
                  .database()
                  .ref(
                    "STORES/" +
                      storeLocator +
                      "/ITEMS DATABASE/" +
                      itemproductCatagory +
                      "/PRODUCTS/" +
                      itemproductDecription +
                      "/SIMILAR ITEMS/" +
                      pDecription +
                      "/onCart/" +
                      firebase.auth().currentUser.uid +
                      "/itemStatus"
                  )
                  .once("value", (snapshot) => {
                    snapshot.forEach((doc) => {
                      products.push({
                        key: pKey,
                        productImage: pImage,
                        productPrice: pPrice,
                        productDecription: pDecription,
                        productCatagory: pCatagory,
                        Quantity: doc.toJSON().Quantity,
                        subCatagory: itemproductDecription,
                        bgColor: "green",
                        favourateIconName: favourateIconName,
                      });
                    });
                  });
              } else {
                products.push({
                  key: pKey,
                  productImage: pImage,
                  productPrice: pPrice,
                  productDecription: pDecription,
                  productCatagory: pCatagory,
                  subCatagory: itemproductDecription,
                  Quantity: "0",
                  bgColor: "white",
                  favourateIconName: favourateIconName,
                });
              }
            });
        });
        this.setState({
          products: products.sort((a, b) => {
            return a.productPrice > b.productPrice;
          }),
        });
      });
  };

  loadData = () => {
    const firebaseDatabase = firebase.database();
    const currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    const groupedItemsProducts = [];
    firebase
      .database()
      .ref(
        "STORES/" +
          storeLocator +
          "/ITEMS DATABASE/" +
          this.state.currentCategory +
          "/PRODUCTS/"
      )
      .once("value", (snapshot) => {
        snapshot.forEach((doc) => {
          let pKey = doc.key;
          let pImage = doc.toJSON().productImage;
          let pPrice = doc.toJSON().productPrice;
          let pDecription = doc.toJSON().productDecription;
          let pCatagory = this.state.currentCategory;
          let pMoreItensIcon = doc.toJSON().moreItensIcon;

          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                this.state.currentCategory +
                "/PRODUCTS/" +
                doc.toJSON().productDecription +
                "/onCart/"
            )
            .on("value", (snapshot) => {
              const onCartUsers = [];
              snapshot.forEach((doc) => {
                onCartUsers.push(doc.toJSON().userID);
              });

              var user_AddedIt_OnCart = onCartUsers.includes(
                firebase.auth().currentUser.uid
              );
              //C. Let's evaluate if the user favourated this item or not and define the icon name accordingly
              const favouriteRef = `STORES/${storeLocator}/ITEMS DATABASE/${
                this.state.currentCategory
              }/PRODUCTS/${doc.toJSON().productDecription}/favourite`;
              let favourateIconName;
              firebaseDatabase.ref(favouriteRef).on("value", (snapshot) => {
                const favouriteUsers = [];
                snapshot.forEach((doc) => {
                  favouriteUsers.push(doc.toJSON().userID);
                });

                var user_Favourated_It = favouriteUsers.includes(currentUserId);

                if (user_Favourated_It === true) {
                  favourateIconName = "md-star-outline";
                } else {
                  favourateIconName = "md-star";
                }
              });

              if (user_AddedIt_OnCart === true) {
                firebase
                  .database()
                  .ref(
                    "STORES/" +
                      storeLocator +
                      "/ITEMS DATABASE/" +
                      this.state.currentCategory +
                      "/PRODUCTS/" +
                      pDecription +
                      "/onCart/" +
                      firebase.auth().currentUser.uid +
                      "/itemStatus"
                  )
                  .on("value", (snapshot) => {
                    snapshot.forEach((doc) => {
                      groupedItemsProducts.push({
                        key: pKey,
                        productImage: pImage,
                        productPrice: pPrice,
                        productDecription: pDecription,
                        productCatagory: pCatagory,
                        Quantity: doc.toJSON().Quantity,
                        bgColor: "red",
                        subCatagory: "NotModal",
                        moreItensIcon: pMoreItensIcon,
                        favourateIconName: favourateIconName,
                      });
                    });
                  });
              } else {
                groupedItemsProducts.push({
                  key: pKey,
                  productImage: pImage,
                  productPrice: pPrice,
                  productDecription: pDecription,
                  productCatagory: pCatagory,
                  Quantity: "0",
                  bgColor: "white",
                  subCatagory: "NotModal",
                  moreItensIcon: pMoreItensIcon,
                  favourateIconName: favourateIconName,
                });
              }
            });
        });
        this.setState({
          groupedItemsProducts: groupedItemsProducts.sort((a, b) => {
            return a.productDecription > b.productDecription;
          }),
          isFetching: false,
        });
      });

    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/"
      )
      .on("value", (snapshot) => {
        const currentShopCartBalance = [];
        snapshot.forEach((doc) => {
          currentShopCartBalance.push({
            noItems: doc.toJSON().noItems,
          });
        });
        if (!currentShopCartBalance.length) {
          return;
        } else {
          firebase
            .database()
            .ref(
              "Users/" +
                firebase.auth().currentUser.uid +
                "/Current_Cart/" +
                this.state.StoreName +
                " (" +
                this.state.StoreLocation +
                ")/" +
                "Balance"
            )
            .on("value", (snapshot) => {
              this.setState({
                noItems: snapshot.toJSON().noItems,
                balance: snapshot.toJSON().Total,
              });
            });
        }
      });
  };

  reLoadData = (catecoryName) => {
    const firebaseDatabase = firebase.database();
    const currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    const groupedItemsProducts = [];
    firebase
      .database()
      .ref(
        "STORES/" +
          storeLocator +
          "/ITEMS DATABASE/" +
          catecoryName +
          "/PRODUCTS/"
      )
      .on("value", (snapshot) => {
        snapshot.forEach((doc) => {
          let pKey = doc.key;
          let pImage = doc.toJSON().productImage;
          let pPrice = doc.toJSON().productPrice;
          let pDecription = doc.toJSON().productDecription;
          let pCatagory = catecoryName;
          let pMoreItensIcon = doc.toJSON().moreItensIcon;

          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                catecoryName +
                "/PRODUCTS/" +
                doc.toJSON().productDecription +
                "/onCart/"
            )
            .on("value", (snapshot) => {
              const onCartUsers = [];
              snapshot.forEach((doc) => {
                onCartUsers.push(doc.toJSON().userID);
              });

              var user_AddedIt_OnCart = onCartUsers.includes(
                firebase.auth().currentUser.uid
              );

              //C. Let's evaluate if the user favourated this item or not and define the icon name accordingly
              const favouriteRef = `STORES/${storeLocator}/ITEMS DATABASE/${catecoryName}/PRODUCTS/${
                doc.toJSON().productDecription
              }/favourite`;
              let favourateIconName;
              firebaseDatabase.ref(favouriteRef).on("value", (snapshot) => {
                const favouriteUsers = [];
                snapshot.forEach((doc) => {
                  favouriteUsers.push(doc.toJSON().userID);
                });

                var user_Favourated_It = favouriteUsers.includes(currentUserId);

                if (user_Favourated_It === true) {
                  favourateIconName = "md-star-outline";
                } else {
                  favourateIconName = "md-star";
                }
              });

              if (user_AddedIt_OnCart === true) {
                firebase
                  .database()
                  .ref(
                    "STORES/" +
                      storeLocator +
                      "/ITEMS DATABASE/" +
                      catecoryName +
                      "/PRODUCTS/" +
                      pDecription +
                      "/onCart/" +
                      firebase.auth().currentUser.uid +
                      "/itemStatus"
                  )
                  .on("value", (snapshot) => {
                    snapshot.forEach((doc) => {
                      groupedItemsProducts.push({
                        key: pKey,
                        productImage: pImage,
                        productPrice: pPrice,
                        productDecription: pDecription,
                        productCatagory: pCatagory,
                        Quantity: doc.toJSON().Quantity,
                        bgColor: "red",
                        subCatagory: "NotModal",
                        moreItensIcon: pMoreItensIcon,
                        favourateIconName: favourateIconName,
                      });
                    });
                  });
              } else {
                groupedItemsProducts.push({
                  key: pKey,
                  productImage: pImage,
                  productPrice: pPrice,
                  productDecription: pDecription,
                  productCatagory: pCatagory,
                  Quantity: "0",
                  bgColor: "white",
                  subCatagory: "NotModal",
                  moreItensIcon: pMoreItensIcon,
                  favourateIconName: favourateIconName,
                });
              }
            });
        });
        this.setState({
          groupedItemsProducts: groupedItemsProducts.sort((a, b) => {
            return a.productDecription > b.productDecription;
          }),
          isFetching: false,
        });
      });

    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/"
      )
      .on("value", (snapshot) => {
        const currentShopCartBalance = [];
        snapshot.forEach((doc) => {
          currentShopCartBalance.push({
            noItems: doc.toJSON().noItems,
          });
        });
        if (!currentShopCartBalance.length) {
          return;
        } else {
          firebase
            .database()
            .ref(
              "Users/" +
                firebase.auth().currentUser.uid +
                "/Current_Cart/" +
                this.state.StoreName +
                " (" +
                this.state.StoreLocation +
                ")/" +
                "Balance"
            )
            .on("value", (snapshot) => {
              this.setState({
                noItems: snapshot.toJSON().noItems,
                balance: snapshot.toJSON().Total,
              });
            });
        }
      });
  };

  onRefresh() {
    this.setState({ isFetching: true }, function () {
      this.loadData();
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3dadd",
    marginTop: 20,
  },
});
