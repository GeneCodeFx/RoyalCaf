import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler,
  Platform,
  Animated,
  Vibration,
  ActivityIndicator,
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
import Swipeable from "react-native-gesture-handler/Swipeable";

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class viewCart extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      StoreName: this.props.navigation.state.params.StoreName,
      StoreLocation: this.props.navigation.state.params.StoreLocation,
      categoriesDisplayed: "ndizwone",
      newItemDescription: "",
      newItemPrice: "",
      modalIsOpen: false,
      activeRowKey: null,
      toRemoveItemName: "",
      deleting: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      const { navigation } = this.props;
      this.focusListener = navigation.addListener("didFocus", () => {
        firebase
          .database()
          .ref(
            "Users/" +
              firebase.auth().currentUser.uid +
              "/Current_Cart/" +
              this.state.StoreName +
              " (" +
              this.state.StoreLocation +
              ")/SelectedItems/"
          )
          .on("value", (snapshot) => {
            const products = [];
            snapshot.forEach((doc) => {
              let P_key = doc.key;
              let P_productImage = doc.toJSON().productImage;
              let P_productPrice = doc.toJSON().productPrice;
              let P_productDecription = doc.toJSON().productDecription;
              let P_Quantity = doc.toJSON().Quantity;
              let P_productSubTotal = doc.toJSON().productSubTotal;
              let P_productCatagory = doc.toJSON().productCatagory;
              let P_subCatagory = doc.toJSON().subCatagory;

              let itemproductDecription = P_productDecription;
              let itemproductCatagory = P_productCatagory;
              let itemsubCatagory = P_subCatagory;

              let storeLocator =
                this.state.StoreName + " (" + this.state.StoreLocation + ")";
              let absoluteReference = "";
              const changeProducts = [];

              firebase
                .database()
                .ref(
                  "Users/" +
                    firebase.auth().currentUser.uid +
                    "/Current_Cart/" +
                    this.state.StoreName +
                    " (" +
                    this.state.StoreLocation +
                    ")/SelectedItems/"
                )
                .once("value", (snapshot) => {
                  const itemsOnCart = [];
                  snapshot.forEach((doc) => {
                    itemsOnCart.push(doc.toJSON().productDecription);
                  });

                  if (itemsubCatagory === "NotModal") {
                    absoluteReference = itemproductDecription;
                    firebase
                      .database()
                      .ref(
                        "STORES/" +
                          storeLocator +
                          "/ITEMS DATABASE/" +
                          itemproductCatagory +
                          "/PRODUCTS/" +
                          absoluteReference +
                          "/SIMILAR ITEMS/"
                      )
                      .on("value", (snapshot) => {
                        snapshot.forEach((doc) => {
                          if (
                            itemsOnCart.includes(
                              doc.toJSON().productDecription
                            ) === false
                          ) {
                            changeProducts.push({
                              key: doc.key,
                              productDecription: doc.toJSON().productDecription,
                            });
                          }
                        });
                      });
                  } else {
                    absoluteReference = itemsubCatagory;
                    firebase
                      .database()
                      .ref(
                        "STORES/" +
                          storeLocator +
                          "/ITEMS DATABASE/" +
                          itemproductCatagory +
                          "/PRODUCTS/" +
                          absoluteReference +
                          "/SIMILAR ITEMS/"
                      )
                      .on("value", (snapshot) => {
                        snapshot.forEach((doc) => {
                          if (
                            itemsOnCart.includes(
                              doc.toJSON().productDecription
                            ) === false
                          ) {
                            changeProducts.push({
                              key: doc.key,
                              productDecription: doc.toJSON().productDecription,
                            });
                          }
                        });
                      });

                    firebase
                      .database()
                      .ref(
                        "STORES/" +
                          storeLocator +
                          "/ITEMS DATABASE/" +
                          itemproductCatagory +
                          "/PRODUCTS/" +
                          absoluteReference
                      )
                      .on("value", (snapshot) => {
                        if (
                          itemsOnCart.includes(
                            snapshot.toJSON().productDecription
                          ) === false
                        ) {
                          changeProducts.push({
                            key: snapshot.val().productImage,
                            productDecription: snapshot.toJSON()
                              .productDecription,
                          });
                        }
                      });
                  }
                });

              if (!changeProducts.length) {
                products.push({
                  key: P_key,
                  productImage: P_productImage,
                  productPrice: P_productPrice,
                  productDecription: P_productDecription,
                  Quantity: P_Quantity,
                  productSubTotal: P_productSubTotal,
                  productCatagory: P_productCatagory,
                  subCatagory: P_subCatagory,
                  arowColor: "white",
                  itemElevation: 0,
                });
              } else {
                products.push({
                  key: P_key,
                  productImage: P_productImage,
                  productPrice: P_productPrice,
                  productDecription: P_productDecription,
                  Quantity: P_Quantity,
                  productSubTotal: P_productSubTotal,
                  productCatagory: P_productCatagory,
                  subCatagory: P_subCatagory,
                  arowColor: "green",
                  itemElevation: 5,
                });
              }
            });
            if (this._isMounted) {
              this.setState({
                products: products.sort((a, b) => {
                  return a.productDecription > b.productDecription;
                }),
                loading: false,
              });
            }
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
              ")/" +
              "Balance"
          )
          .on("value", (snapshot) => {
            this.setState({
              noItems: snapshot.val().noItems,
              balance: snapshot.val().Total,
            });
          });
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.handleBackButton
        );
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
    if (this.state.modalIsOpen === true) {
      this.refs.moreItemsModal.close();
      return true;
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  onPressChange = (
    itemproductDecription,
    itemproductCatagory,
    itemsubCatagory,
    itemproductSubTotal,
    passedQuantity
  ) => {
    this.setState({
      toDeleteitemDescription: itemproductDecription,
      toDeleteitemsubCatagory: itemsubCatagory,
      toDeleteproductCatagory: itemproductCatagory,
      toDeletepassedQuantity: passedQuantity,
      toDeleteitemproductSubTotal: itemproductSubTotal,
    });

    let storeLocator =
      this.state.StoreName + " (" + this.state.StoreLocation + ")";
    let absoluteReference = "";
    const changeProducts = [];

    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/SelectedItems/"
      )
      .once("value", (snapshot) => {
        const itemsOnCart = [];
        snapshot.forEach((doc) => {
          itemsOnCart.push(doc.toJSON().productDecription);
        });

        if (itemsubCatagory === "NotModal") {
          absoluteReference = itemproductDecription;
          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                itemproductCatagory +
                "/PRODUCTS/" +
                absoluteReference +
                "/SIMILAR ITEMS/"
            )
            .on("value", (snapshot) => {
              snapshot.forEach((doc) => {
                if (
                  itemsOnCart.includes(doc.toJSON().productDecription) === false
                ) {
                  changeProducts.push({
                    key: doc.key,
                    productImage: doc.toJSON().productImage,
                    productPrice: doc.toJSON().productPrice,
                    productDecription: doc.toJSON().productDecription,
                    productCatagory: doc.toJSON().productCatagory,
                    Quantity: doc.toJSON().Quantity,
                    subCatagory: doc.toJSON().subCatagory,
                  });
                }
              });
            });
        } else {
          absoluteReference = itemsubCatagory;
          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                itemproductCatagory +
                "/PRODUCTS/" +
                absoluteReference +
                "/SIMILAR ITEMS/"
            )
            .on("value", (snapshot) => {
              snapshot.forEach((doc) => {
                if (
                  itemsOnCart.includes(doc.toJSON().productDecription) === false
                ) {
                  changeProducts.push({
                    key: doc.key,
                    productImage: doc.toJSON().productImage,
                    productPrice: doc.toJSON().productPrice,
                    productDecription: doc.toJSON().productDecription,
                    productCatagory: doc.toJSON().productCatagory,
                    Quantity: doc.toJSON().Quantity,
                    subCatagory: doc.toJSON().subCatagory,
                  });
                }
              });
            });

          firebase
            .database()
            .ref(
              "STORES/" +
                storeLocator +
                "/ITEMS DATABASE/" +
                itemproductCatagory +
                "/PRODUCTS/" +
                absoluteReference
            )
            .on("value", (snapshot) => {
              if (
                itemsOnCart.includes(snapshot.toJSON().productDecription) ===
                false
              ) {
                changeProducts.push({
                  key: snapshot.val().productImage,
                  productImage: snapshot.val().productImage,
                  productPrice: snapshot.toJSON().productPrice,
                  productDecription: snapshot.toJSON().productDecription,
                  productCatagory: itemproductCatagory,
                  Quantity: 0,
                  subCatagory: "NotModal",
                });
              }
            });
        }
      });

    this.setState({
      changeProducts: changeProducts.sort((a, b) => {
        return a.CategoryName > b.CategoryName;
      }),
      modalIsOpen: true,
    });

    if (!changeProducts.length) {
      return;
    } else {
      this.setState({
        modalIsOpen: true,
      });
    }
    this.refs.moreItemsModal.open();
  };

  _onPressReplace = (
    toPassitemDescription,
    toPassitemproductPrice,
    toPassitemproductImage,
    toPassproductCatagory,
    toPasspassedQuantity,
    toPassitemsubCatagory
  ) => {
    let _currentUserId = firebase.auth().currentUser.uid;

    let itemDescription = this.state.toDeleteitemDescription;
    let productCatagory = this.state.toDeleteproductCatagory;
    let passedQuantity = this.state.toDeletepassedQuantity;
    let itemproductSubTotal = this.state.toDeleteitemproductSubTotal;
    let itemsubCatagory = this.state.toDeleteitemsubCatagory;

    var newSubtotal =
      parseFloat(toPassitemproductPrice) * parseFloat(passedQuantity);
    var NewBalance =
      parseFloat(this.state.balance) -
      parseFloat(itemproductSubTotal) +
      newSubtotal;

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
        Total: NewBalance.toFixed(2),
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
      .remove();

    if (itemsubCatagory === "NotModal") {
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
        .remove();
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
            itemsubCatagory +
            "/SIMILAR ITEMS/" +
            itemDescription +
            "/onCart/" +
            _currentUserId
        )
        .remove();
    }

    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/SelectedItems/"
      )
      .once("value", (snapshot) => {
        const itemsOnCart = [];
        snapshot.forEach((doc) => {
          itemsOnCart.push(doc.toJSON().productDecription);
        });

        var newItemOnCartAlready = itemsOnCart.includes(toPassitemDescription);

        if (newItemOnCartAlready === true) {
          firebase
            .database()
            .ref(
              "Users/" +
                firebase.auth().currentUser.uid +
                "/Current_Cart/" +
                this.state.StoreName +
                " (" +
                this.state.StoreLocation +
                ")/SelectedItems/" +
                toPassitemDescription
            )
            .once("value", (snapshot) => {
              let LocalproductDecription = snapshot.toJSON().productDecription;
              let LocalQuantity = snapshot.toJSON().Quantity;
              let LocalproductSubTotal = snapshot.toJSON().productSubTotal;
              let LocalproductCatagory = snapshot.toJSON().productCatagory;
              let LocalsubCatagory = snapshot.toJSON().subCatagory;

              if (toPassitemsubCatagory === "NotModal") {
                firebase
                  .database()
                  .ref(
                    "STORES/" +
                      this.state.StoreName +
                      " (" +
                      this.state.StoreLocation +
                      ")/ITEMS DATABASE/" +
                      LocalproductCatagory +
                      "/PRODUCTS/" +
                      LocalproductDecription +
                      "/onCart/" +
                      _currentUserId +
                      "/itemStatus/userStatus"
                  )
                  .update({
                    Quantity:
                      parseInt(LocalQuantity) + parseInt(passedQuantity),
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
                      LocalproductCatagory +
                      "/PRODUCTS/" +
                      LocalsubCatagory +
                      "/SIMILAR ITEMS/" +
                      LocalproductDecription +
                      "/onCart/" +
                      _currentUserId +
                      "/itemStatus/userStatus"
                  )
                  .update({
                    Quantity:
                      parseInt(LocalQuantity) + parseInt(passedQuantity),
                  });
              }

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
                    toPassitemDescription
                )
                .update({
                  Quantity: parseInt(LocalQuantity) + parseInt(passedQuantity),
                  productPrice:
                    parseFloat(LocalproductSubTotal) +
                    parseFloat(toPassitemproductPrice),
                });
            });
        } else {
          if (toPassitemsubCatagory === "NotModal") {
            firebase
              .database()
              .ref(
                "STORES/" +
                  this.state.StoreName +
                  " (" +
                  this.state.StoreLocation +
                  ")/ITEMS DATABASE/" +
                  toPassproductCatagory +
                  "/PRODUCTS/" +
                  toPassitemDescription +
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
                  toPassproductCatagory +
                  "/PRODUCTS/" +
                  toPassitemDescription +
                  "/onCart/" +
                  _currentUserId +
                  "/itemStatus/userStatus"
              )
              .update({
                Quantity: passedQuantity,
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
                  toPassproductCatagory +
                  "/PRODUCTS/" +
                  toPassitemsubCatagory +
                  "/SIMILAR ITEMS/" +
                  toPassitemDescription +
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
                  toPassproductCatagory +
                  "/PRODUCTS/" +
                  toPassitemsubCatagory +
                  "/SIMILAR ITEMS/" +
                  toPassitemDescription +
                  "/onCart/" +
                  _currentUserId +
                  "/itemStatus/userStatus"
              )
              .update({
                Quantity: passedQuantity,
              });
          }

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
                toPassitemDescription
            )
            .update({
              Quantity: passedQuantity,
              productPrice: toPassitemproductPrice,
              productDecription: toPassitemDescription,
              productImage: toPassitemproductImage,
              productSubTotal: newSubtotal,
              productCatagory: toPassproductCatagory,
              subCatagory: toPassitemsubCatagory,
            });
        }
      });

    this.refs.moreItemsModal.close();
  };

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

    //Vibration.vibrate(100)
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

    //ToastAndroid.showWithGravity( 'R' + SelectedItemPrice + ' ' + itemDescription + ' added to your cart', ToastAndroid.SHORT, ToastAndroid.TOP);
  };

  onPressAddToCartModal = (
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

    //Vibration.vibrate(100)
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
            itemsubCatagory +
            "/SIMILAR ITEMS/" +
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
            itemsubCatagory +
            "/SIMILAR ITEMS/" +
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
            itemsubCatagory +
            "/SIMILAR ITEMS/" +
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
            itemsubCatagory +
            "/SIMILAR ITEMS/" +
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
    //ToastAndroid.showWithGravity( 'R' + SelectedItemPrice + ' ' + itemDescription + ' added to your cart', ToastAndroid.SHORT, ToastAndroid.TOP);

    //this.refs.moreItemsModal.close()
  };

  _onPressClearCart = () => {
    firebase
      .database()
      .ref(
        "STORES/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/ITEMS DATABASE/"
      )
      .once("value", (snapshot) => {
        snapshot.forEach((doc) => {
          let dataFormartDel = {
            key: doc.key,
            CategoryName: doc.toJSON().CategoryName,
            pass: "",
          };

          if (dataFormartDel.pass === "") {
            firebase
              .database()
              .ref(
                "STORES/" +
                  this.state.StoreName +
                  " (" +
                  this.state.StoreLocation +
                  ")/ITEMS DATABASE/" +
                  dataFormartDel.CategoryName +
                  "/PRODUCTS/"
              )
              .once("value", (snapshot) => {
                snapshot.forEach((doc) => {
                  let preDecription = doc.toJSON().productDecription;
                  let preCatagory = dataFormartDel.CategoryName;

                  firebase
                    .database()
                    .ref(
                      "STORES/" +
                        this.state.StoreName +
                        " (" +
                        this.state.StoreLocation +
                        ")/ITEMS DATABASE/" +
                        preCatagory +
                        "/PRODUCTS/" +
                        preDecription +
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

                      if (user_AddedIt_OnCart === true) {
                        firebase
                          .database()
                          .ref(
                            "STORES/" +
                              this.state.StoreName +
                              " (" +
                              this.state.StoreLocation +
                              ")/ITEMS DATABASE/" +
                              preCatagory +
                              "/PRODUCTS/" +
                              preDecription +
                              "/onCart/" +
                              firebase.auth().currentUser.uid
                          )
                          .remove();
                      }
                    });
                });
              });
          }
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
          ")/" +
          "Balance"
      )
      .update({
        noItems: 0,
        Total: 0,
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
          ")/SelectedItems"
      )
      .remove();

    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/ModalRefs/"
      )
      .once("value", (snapshot) => {
        snapshot.forEach((doc) => {
          let modalReference = doc.toJSON().deletingRef;
          firebase.database().ref(modalReference).remove();
        });
      });

    this.props.navigation.goBack();
  };

  _clearCartWarningModal = () => {
    this.refs.deleteItemWarningModal.open();
    Vibration.vibrate(800);
  };

  _onSwipeRight = () => {
    alert(this.state.toRemoveItemName);
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
    //this.refs.pleaseWaitModal.close();
    this.setState({ deleting: false });
    this.props.navigation.goBack();
  };

  render() {
    const RightActions = ({
      progress,
      dragX,
      onPress,
      swipedItemDescription,
    }) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });
      return (
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              //flex: 1,
              height: "94%",
              backgroundColor: "red",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: one * 2,
            }}
          >
            <Animated.Text
              style={{
                color: "white",
                paddingHorizontal: one * 5,
                fontWeight: "600",
                fontSize: one * 21,
                transform: [{ scale }],
              }}
            >
              Remove
            </Animated.Text>
          </View>
        </TouchableOpacity>
      );
    };

    const LeftActions = ({
      progress,
      dragX,
      onPressMinus,
      onPressPlus,
      swipedItemDescription,
    }) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 100],
        outputRange: [0, 1],
        extrapolate: "clamp",
      });
      return (
        <View
          style={{
            //flex: 1,
            height: "94%",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: one * 2,
            backgroundColor: "pink",
            alignItems: "center",
            width: screenWidth * 0.18,
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale }],
              flex: 1,
            }}
          >
            <TouchableOpacity onPress={onPressPlus}>
              <AntDesign name="caretup" size={one * 35} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressMinus}>
              <AntDesign name="caretdown" size={one * 35} color="red" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <View
          style={{
            height: screenHeight * 0.06,
            width: "100%",
            backgroundColor: "#ed0971",
            //alignContent: 'center',
            justifyContent: "space-between",
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
              width: "80%",
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
                marginTop: one * 3,
                alignSelf: "center",
              }}
            >
              {" "}
              In Your Cart
            </Text>
          </View>
          <TouchableOpacity onPress={() => this._clearCartWarningModal()}>
            <MaterialCommunityIcons
              name="delete-forever-outline"
              size={one * 32}
              color="white"
              style={{
                marginTop: one * 6,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {this.state.deleting ? (
            <View
              style={{
                position: "absolute",
                alignSelf: "center",
                backgroundColor: "white",
                borderRadius: one * 10,
                top: "45%",
              }}
            >
              <ActivityIndicator size="large" color="red" />
            </View>
          ) : (
            <View />
          )}
        </View>
        <Modal
          ref={"pleaseWaitModal"}
          style={{
            justifyContent: "center",
            borderRadius: Platform.OS === "ios" ? one * 30 : 0,
            shadowRadius: one * 10,
            width: screenWidth * 0.8,
            height: one * 200,
            backgroundColor: "#990849",
            marginBottom: one * 20,
          }}
          position="center"
          backdrop={false}
          onOpened={() => {
            setTimeout(() => {
              this._clearCartOptimized();
            }, 100);
          }}
          onClosed={() => {}}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: one * 20,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: one * 10,
              }}
            >
              Deleting!
            </Text>
          </View>
        </Modal>
        <Modal
          ref={"deleteItemWarningModal"}
          style={{
            justifyContent: "center",
            borderRadius: Platform.OS === "ios" ? one * 30 : 0,
            shadowRadius: one * 10,
            width: screenWidth * 0.8,
            height: one * 200,
            backgroundColor: "#990849",
            marginBottom: one * 20,
          }}
          position="center"
          backdrop={true}
          onClosed={() => {}}
        >
          <Text
            style={{
              color: "white",
              fontSize: one * 20,
              fontWeight: "500",
              textAlign: "center",
              marginBottom: one * 10,
            }}
          >
            WARNING!
          </Text>
          <Text
            style={{
              color: "white",
              //height: 20,
              alignSelf: "center",
              marginLeft: one * 10,
              marginRight: one * 10,
              fontSize: one * 16,
              fontWeight: "800",
            }}
          >
            ARE YOU SURE YOU WANT TO CLEAR YOUR CART?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              style={{ fontSize: one * 18, color: "white" }}
              containerStyle={{
                padding: one * 8,
                //marginLeft: one*10,
                height: one * 40,
                borderRadius: one * 6,
                backgroundColor: "#ed6fa8",
                marginTop: one * 30,
                width: "40%",
              }}
              onPress={() => this.refs.deleteItemWarningModal.close()}
            >
              NO
            </Button>
            <Button
              style={{ fontSize: one * 18, color: "white" }}
              containerStyle={{
                padding: one * 8,
                marginLeft: one * 10,
                height: one * 40,
                borderRadius: one * 6,
                backgroundColor: "#ed6fa8",
                marginTop: one * 30,
                width: "40%",
              }}
              // onPress={() => {
              //   this.setState({ deleting: true });
              //   setTimeout(() => {
              //     this._clearCartOptimized();
              //   }, 100);
              //   this.refs.deleteItemWarningModal.close();
              // }}
              onPress={() =>
                this.props.navigation.navigate("clearCartView", {
                  products: this.state.products,
                  StoreName: this.state.StoreName,
                  StoreLocation: this.state.StoreLocation,
                })
              }
            >
              YES
            </Button>
          </View>
        </Modal>
        <View
          style={{
            width: "98%",
            paddingBottom: one * 2,
            //backgroundColor: 'white',
            alignSelf: "center",
            alignItems: "center",
            alignContent: "center",
            height: "87%",
          }}
        >
          <FlatList
            //horizontal={true}
            //numColumns={2}
            data={this.state.products}
            renderItem={({ item, index }) => {
              return (
                <Swipeable
                  renderRightActions={(progress, dragX) => (
                    <RightActions
                      progress={progress}
                      dragX={dragX}
                      swipedItemDescription={item.productDecription}
                      onPress={() => {
                        let itemDescription = item.productDecription;
                        let productCatagory = item.productCatagory;
                        let passedQuantity = item.Quantity;
                        let itemproductSubTotal = item.productSubTotal;
                        let itemsubCatagory = item.subCatagory;

                        if (this.state.noItems > 1) {
                          let _currentUserId = firebase.auth().currentUser.uid;
                          var CurrentBalance = parseFloat(this.state.balance);
                          var NewBalance =
                            CurrentBalance - parseFloat(itemproductSubTotal);

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
                              noItems:
                                parseInt(this.state.noItems) -
                                parseInt(passedQuantity),
                              Total: NewBalance.toFixed(2),
                            });

                          Vibration.vibrate(200);

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
                            .remove();

                          if (itemsubCatagory === "NotModal") {
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
                              .remove();
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
                                  itemsubCatagory +
                                  "/SIMILAR ITEMS/" +
                                  itemDescription +
                                  "/onCart/" +
                                  _currentUserId
                              )
                              .remove();
                          }
                        } else {
                          this._clearCartWarningModal();
                        }
                      }}
                    />
                  )}
                  renderLeftActions={(progress, dragX) => (
                    <LeftActions
                      progress={progress}
                      dragX={dragX}
                      swipedItemDescription={item.productDecription}
                      onPressPlus={() => {
                        let itemDescription = item.productDecription;
                        let itemproductPrice = item.productPrice;
                        let itemproductImage = item.productImage;
                        let productCatagory = item.productCatagory;
                        let passedQuantity = item.Quantity;
                        let itemproductSubTotal = item.productSubTotal;
                        let itemsubCatagory = item.subCatagory;

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

                        if (passedQuantity !== 0) {
                          let _newQuantity = parseInt(passedQuantity) + 1;
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
                              Quantity: _newQuantity,
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
                              Quantity: _newQuantity,
                              productPrice: SelectedItemPrice,
                              productDecription: itemDescription,
                              productImage: itemproductImage,
                              productSubTotal:
                                parseFloat(itemproductSubTotal.toFixed(2)) +
                                parseFloat(SelectedItemPrice.toFixed(2)),
                            });

                          if (itemsubCatagory === "NotModal") {
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
                                Quantity: _newQuantity,
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
                                  itemsubCatagory +
                                  "/SIMILAR ITEMS/" +
                                  itemDescription +
                                  "/onCart/" +
                                  _currentUserId +
                                  "/itemStatus/userStatus"
                              )
                              .update({
                                Quantity: _newQuantity,
                              });
                          }
                        } else {
                          alert(
                            "You need to add at least one item in your cart"
                          );
                        }
                      }}
                      onPressMinus={() => {
                        let itemDescription = item.productDecription;
                        let itemproductPrice = item.productPrice;
                        let itemproductImage = item.productImage;
                        let productCatagory = item.productCatagory;
                        let passedQuantity = item.Quantity;
                        let itemproductSubTotal = item.productSubTotal;
                        let itemsubCatagory = item.subCatagory;

                        let _currentUserId = firebase.auth().currentUser.uid;
                        var CurrentBalance = parseFloat(this.state.balance);
                        var SelectedItemPrice = parseFloat(itemproductPrice);
                        var NewBalance = CurrentBalance - SelectedItemPrice;

                        Vibration.vibrate(100);

                        if (passedQuantity > 1) {
                          let _newQuantity = parseInt(passedQuantity) - 1;

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
                              noItems: parseInt(this.state.noItems) - 1,
                              Total: NewBalance.toFixed(2),
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
                              Quantity: _newQuantity,
                              productPrice: SelectedItemPrice,
                              productDecription: itemDescription,
                              productImage: itemproductImage,
                              productSubTotal:
                                parseFloat(itemproductSubTotal.toFixed(2)) -
                                parseFloat(SelectedItemPrice.toFixed(2)),
                            });

                          if (itemsubCatagory === "NotModal") {
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
                                Quantity: _newQuantity,
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
                                  itemsubCatagory +
                                  "/SIMILAR ITEMS/" +
                                  itemDescription +
                                  "/onCart/" +
                                  _currentUserId +
                                  "/itemStatus/userStatus"
                              )
                              .update({
                                Quantity: _newQuantity,
                              });
                          }
                        } else {
                          alert(
                            "Quantity cannot be less than 1, click 'Remove' button if you want to remove this item from the cart"
                          );
                        }
                      }}
                    />
                  )}
                >
                  <View
                    style={{
                      height: screenHeight * 0.1,
                      width: "100%",
                      //marginBottom: one,
                      //marginHorizontal: one*2,
                      marginVertical: one * 2,
                      flexDirection: "row",
                      alignSelf: "center",
                      backgroundColor: "white",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        //height: screenHeight*0.36,
                        width: "20%",
                        backgroundColor: "white",
                      }}
                    >
                      <Image
                        source={{ uri: item.productImage }}
                        style={{
                          height: screenHeight * 0.1,
                          width: screenHeight * 0.1,
                          alignSelf: "center",
                        }}
                        resizeMode="contain"
                      ></Image>
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: one * 55,
                          bottom: one * 44,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          width: screenWidth * 0.07,
                        }}
                      >
                        <Text
                          style={{
                            color: "red",
                            fontSize: one * 17,
                            fontWeight: "900",
                            backgroundColor: "white",
                          }}
                        >
                          {" "}
                          {item.Quantity}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: "white",
                        height: "100%",
                        width: "40%",
                        paddingLeft: one * 3,
                      }}
                    >
                      <ScrollView
                        contentContainerStyle={{
                          flexGrow: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          numberOfLines={3}
                          style={{
                            color: "black",
                            fontSize: one * 15,
                            fontWeight: "bold",
                            alignSelf: "flex-start",
                          }}
                        >
                          {item.productDecription}
                        </Text>
                      </ScrollView>
                    </View>
                    <View
                      style={{
                        backgroundColor: "white",
                        height: "100%",
                        width: "40%",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          //backgroundColor: 'red',
                          height: "100%",
                          width: "30%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            this.onPressChange(
                              item.productDecription,
                              item.productCatagory,
                              item.subCatagory,
                              item.productSubTotal,
                              item.Quantity
                            )
                          }
                          style={{
                            backgroundColor: "white",
                            height: "60%",
                            width: "80%",
                            justifyContent: "center",
                            elevation: item.itemElevation,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MaterialIcons
                            name="swap-vert"
                            size={one * 35}
                            color={item.arowColor}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          //backgroundColor: 'pink',
                          height: "100%",
                          width: "70%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            color: "black",
                            fontSize: one * 16,
                            fontWeight: "bold",
                            //backgroundColor: '#ffbad1',
                          }}
                        >
                          R{item.productSubTotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Swipeable>
              );
            }}
          ></FlatList>
        </View>
        <Modal
          ref={"moreItemsModal"}
          style={{
            //justifyContent: 'center',
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
              //justifyContent: 'flex-start',
              //alignItems: 'flex-start'
            }}
          >
            <FlatList
              //horizontal={true}
              keyExtractor={(item, index) => String(index)}
              numColumns={2}
              data={this.state.changeProducts}
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
                    <View
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
                    </View>
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
                          //alignSelf: 'center',
                          width: "100%",
                          backgroundColor: "white",
                          justifyContent: "center",
                          //alignItems: 'center',
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          //onPress={() => this.refs.moreItemsModal.close()}
                          onPress={() =>
                            this._onPressReplace(
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
                            width: "90%",
                            backgroundColor: "#ed0971",
                            //alignContent: 'center',
                            justifyContent: "center",
                            flexDirection: "row",
                            marginLeft: one * 2,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: one * 12,
                              fontWeight: "bold",
                              alignSelf: "center",
                            }}
                          >
                            SELECT
                          </Text>
                        </TouchableOpacity>
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
              //backgroundColor: 'red',
              //justifyContent: 'center',
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
              {" "}
              {this.state.noItems}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CheckOut", {
                StoreName: this.state.StoreName,
                products: this.state.products,
                balance: this.state.balance,
                noItems: this.state.noItems,
                StoreName: this.state.StoreName,
                StoreLocation: this.state.StoreLocation,
              })
            }
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
              {" "}
              Checkout
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
      </View>
    );
  }

  onPressAddToCart = (itemDescription, itemproductPrice, itemproductImage) => {
    // if (this.state.HeadID === ''||this.state.StoreLocation === '' ) {
    //   alert("You must enter both the Store Name and the Head's ID");
    // return;
    // }

    //let HeadID = this.state.HeadID.trim()

    firebase
      .database()
      .ref(
        "Users/" +
          firebase.auth().currentUser.uid +
          "/Current_Cart/" +
          this.state.StoreName +
          " (" +
          this.state.StoreLocation +
          ")/SelectedItems/" +
          itemDescription
      )
      .update({
        productPrice: itemproductPrice,
        productDecription: itemDescription,
        productImage: itemproductImage,
      });

    var CurrentBalance = parseFloat(this.state.balance);
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = CurrentBalance + SelectedItemPrice;
    this.setState({
      noItems: parseInt(this.state.noItems) + 1,
      balance: NewBalance.toFixed(2),
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
          ")/" +
          "Balance"
      )
      .update({
        noItems: parseInt(this.state.noItems) + 1,
        Total: NewBalance.toFixed(2),
      });

    //alert(itemDescription + ' added to cart')
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3dadd",
    marginTop: 20,
  },
});
