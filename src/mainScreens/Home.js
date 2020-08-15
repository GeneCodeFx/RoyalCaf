import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler,
  Platform,
  ToastAndroid,
  Vibration,
  Alert,
  TouchableHighlight,
} from "react-native";
import firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "react-native-button";
import Modal from "react-native-modalbox";
import {
  AntDesign,
  Foundation,
  Entypo,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

export default class Home extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  //_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      StoreName: "SPAR",
      StoreLocation: "Makhado",
      categoriesDisplayed: "ndizwone",
      newItemDescription: "",
      newItemPrice: "",
      newItemImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQXahYkYMAvu77jwqTZtCe7k1TshTX_VqU8lZxpjl2EJfpqlGL&s",
      noItems: 0,
      balance: 0,
      modalIsOpen: false,
      leaveShopModalIsOpen: false,
      loading: true,
      shopIsEmpty: false,
    };
  }

  componentDidMount() {
    //this._isMounted = true;
    const { navigation } = this.props;
    // this.focusListener = navigation.addListener("didFocus", () => {
    const firebaseDatabase = firebase.database();
    const currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;
    const itemsDatabaseRef = `STORES/${storeLocator}/ITEMS DATABASE/`;

    firebaseDatabase.ref(itemsDatabaseRef).on("value", (snapshot) => {
      this.setState({ loading: true });
      const StoreShelves = [];
      const StoreShelvesTop = [];
      snapshot.forEach((doc) => {
        // For each Category in the Database
        let dataFormart = {
          key: doc.key,
          CategoryName: doc.toJSON().CategoryName,
          catagoryProducts: [],
        };

        //Push the category name into the storeShelvesTop array
        StoreShelvesTop.push({
          key: doc.key,
          CategoryName: doc.toJSON().CategoryName,
        });

        const productsCategoriesRef = `${itemsDatabaseRef}/${dataFormart.CategoryName}/PRODUCTS`;
        firebaseDatabase.ref(productsCategoriesRef).on("value", (snapshot) => {
          snapshot.forEach((doc) => {
            //For Each Product inside the Category, perform the following three activities
            //1. Save the item's data
            let pKey = doc.key;
            let pImage = doc.toJSON().productImage;
            let pPrice = doc.toJSON().productPrice;
            let pDecription = doc.toJSON().productDecription;
            let pCatagory = dataFormart.CategoryName;
            let pMoreItensIcon = doc.toJSON().moreItensIcon;

            //2. Check if the user has added this item on their cart
            //We do this by: [A]Creating an array/list of all users who added this product on their cart and then [B]Check if the cuurent user is on that list

            //A. Let's create the list and call it "onCartUsers"
            const onCartRef = `${productsCategoriesRef}/${pDecription}/onCart`;
            firebaseDatabase.ref(onCartRef).on("value", (snapshot) => {
              const onCartUsers = [];
              snapshot.forEach((doc) => {
                onCartUsers.push(doc.toJSON().userID);
              });

              //B. Let's check if this user is on the list. We will get true if the user is on the list otherwise we will get false
              var user_AddedIt_OnCart = onCartUsers.includes(currentUserId);

              //C. Let's evaluate if the user favourated this item or not and define the icon name accordingly
              const favouriteRef = `${productsCategoriesRef}/${pDecription}/favourite`;
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

              //3.Push all of this product's data as one object to the "dataFormart" array
              if (user_AddedIt_OnCart === true) {
                //Before pushing it, get how many times it was added and save that value on the variable named Quantity
                const itemStatusRef = `${onCartRef}/${currentUserId}/itemStatus`;
                firebaseDatabase.ref(itemStatusRef).on("value", (snapshot) => {
                  snapshot.forEach((doc) => {
                    dataFormart.catagoryProducts.push({
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
                //Give it a Quantity value of 0
                dataFormart.catagoryProducts.push({
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
        });

        StoreShelves.push(dataFormart);
      });
      //Save all the data downloaded into state and sort them accordingly
      this.setState({
        StoreShelves: StoreShelves.sort((a, b) => {
          return a.CategoryName > b.CategoryName;
        }),
        StoreShelvesTop: StoreShelvesTop.sort((a, b) => {
          return a.CategoryName < b.CategoryName;
        }),
        loading: false,
      });
      if (!StoreShelvesTop.length) {
        this.setState({ shopIsEmpty: true });
      }
    });

    //Let's check if the user has anything on cart for this store
    firebaseDatabase
      .ref(`Users/${currentUserId}/Current_Cart/${storeLocator}`)
      .on("value", (snapshot) => {
        const currentShopCartBalance = [];
        snapshot.forEach((doc) => {
          currentShopCartBalance.push({
            noItems: doc.toJSON().noItems,
          });
        });
        //If they don't have anything we'll do nothing otherwise we will download the number of items on their cart and the total balance and save it on the state
        if (!currentShopCartBalance.length) {
          return;
        } else {
          firebaseDatabase
            .ref(`Users/${currentUserId}/Current_Cart/${storeLocator}/Balance`)
            .on("value", (snapshot) => {
              this.setState({
                noItems: snapshot.toJSON().noItems,
                balance: snapshot.toJSON().Total,
              });
            });
        }
      });

    // BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    // // });

    // this.focusListener = navigation.addListener("didBlur", () => {
    //   BackHandler.removeEventListener(
    //     "hardwareBackPress",
    //     this.handleBackButton
    //   );
    // });
  }

  componentWillUnmount() {
    this.setState({
      StoreShelves: {},
    });
    //this._isMounted = false;
    // BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    // this.focusListener.remove();
  }

  //General Functions
  leaveAndClearCart = () => {
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

    //firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/Current_Cart/' + this.state.StoreName  + ' (' + this.state.StoreLocation +')/ModalRefs/').remove()
    ToastAndroid.show(
      "Thank you for visiting " + this.state.StoreName,
      ToastAndroid.SHORT
    );
  };

  handleBackButton = () => {
    if (this.state.modalIsOpen === true) {
      this.refs.moreItemsModal.close();
      return true;
    } else if (this.state.noItems !== 0) {
      if (this.state.leaveShopModalIsOpen === true) {
        this.refs.deleteItemWarningModal.close();
        return true;
      } else {
        this.refs.deleteItemWarningModal.open();
        Vibration.vibrate(800);
        return true;
      }
    }
  };

  onPressBack = () => {
    if (this.state.noItems !== 0) {
      this.refs.deleteItemWarningModal.open();
      Vibration.vibrate(800);
    } else {
      //alert('Thanks for shopping')
      ToastAndroid.show(
        "Thanks for visiting " + this.state.StoreName,
        ToastAndroid.SHORT
      );
      this.props.navigation.goBack();
    }
  };

  //Shopping Functions
  onPressAddToCart = (
    itemDescription,
    itemproductPrice,
    itemproductImage,
    productCatagory,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Calculate the new total
    var SelectedItemPrice = parseFloat(itemproductPrice);
    var NewBalance = parseFloat(this.state.balance) + SelectedItemPrice;

    //Add passed and calculated info into the store database
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}`;
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
    let updateBalanceRef = `Users/${_currentUserId}/Current_Cart/${storeLocator}/Balance`;
    firebaseDatabase.ref(updateBalanceRef).update({
      noItems: parseInt(this.state.noItems) + 1,
      Total: NewBalance.toFixed(2),
    });

    Vibration.vibrate(50);
    ToastAndroid.showWithGravity(
      `R${SelectedItemPrice} R${itemDescription} added to your cart`,
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };
  onPressAddFavourate = (
    itemDescription,
    itemproductPrice,
    itemproductImage,
    productCatagory,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Add  userID into the store database under the favourated item
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemDescription}/favourite/${_currentUserId}`;
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
  };
  onPressRemoveFavourate = (itemDescription, productCatagory) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

    //Remove  userID from the store database under the product's favourate list
    let selectedItemRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemDescription}/favourite`;
    firebaseDatabase.ref(selectedItemRef).remove();

    //Remove the product listing from the user's database under Favourites
    let addItemToUserCartRef = `Users/${_currentUserId}/Favourites/${storeLocator}/${itemDescription}`;
    firebaseDatabase.ref(addItemToUserCartRef).remove();

    Vibration.vibrate(150);
  };
  onPressPlus = (
    itemDescription,
    itemproductPrice,
    productCatagory,
    passedQuantity
  ) => {
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
    let updateQtyRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}/itemStatus/userStatus`;
    firebaseDatabase.ref(updateQtyRef).update({
      Quantity: _newQuantity,
    });
  };
  onPressMinus = (
    itemDescription,
    itemproductPrice,
    productCatagory,
    passedQuantity
  ) => {
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
      let updateQtyRef = `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}/itemStatus/userStatus`;
      firebaseDatabase.ref(updateQtyRef).update({
        Quantity: _newQuantity,
      });
    } else {
      firebaseDatabase.ref(addItemToUserCartRef).remove();

      firebaseDatabase
        .ref(
          `STORES/${storeLocator}/ITEMS DATABASE/${productCatagory}/PRODUCTS/${itemDescription}/onCart/${_currentUserId}`
        )
        .remove();
    }
  };
  onPressMoreItems = (itemproductDecription, itemproductCatagory) => {
    this.setState({
      ModalProductDecription: itemproductDecription,
      ModalProductCatagory: itemproductCatagory,
    });

    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
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
    productCatagory,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

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
  onPressRemoveFavourateModal = (
    itemDescription,
    productCatagory,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

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
    productCatagory,
    passedQuantity,
    itemsubCatagory
  ) => {
    //Define a few useful variables
    const firebaseDatabase = firebase.database();
    const _currentUserId = firebase.auth().currentUser.uid;
    const storeLocator = `${this.state.StoreName} (${this.state.StoreLocation})`;

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
    productCatagory,
    passedQuantity,
    itemsubCatagory
  ) => {
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
    const _currentUserId = firebase.auth().currentUser.uid;
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

  render() {
    const NoCartView = (
      <View
        style={{
          height: "7%",
          width: "100%",
          backgroundColor: "#ed0971",
          flexDirection: "row",
          //alignSelf: 'flex-end',
          position: "absolute",
          bottom: 0,
          //top: one*597
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
            //alignContent: 'center',
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: one * 4,
            borderWidth: one,
            //marginTop: one*1,
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
      shopPaddingBottom = one * 48;
    } else {
      ShoppingCart = (
        <View
          style={{ height: screenHeight * 0.001, alignSelf: "flex-end" }}
        ></View>
      );
      shopPaddingBottom = one * 5;
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
          {this.state.loading ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <View />
          )}
        </View>
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            width: "98%",
            height: "20%",
            flex: 1,
          }}
        >
          {this.state.shopIsEmpty ? (
            <View
              style={{
                alignSelf: "center",
                width: "100%",
                height: "100%",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: one * 25,
                }}
              >
                The store is under maintanace, please come come back later
              </Text>
            </View>
          ) : (
            <View />
          )}
        </View>

        <View
          style={{
            height: screenHeight * 0.06,
            width: "100%",
            backgroundColor: "#ed0971",
            alignContent: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: one * 10,
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Ionicons
              name="ios-menu"
              color={"white"}
              size={one * 35}
              style={{
                marginTop: one * 1,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              height: screenHeight * 0.06,
              width: "70%",
              alignContent: "center",
              justifyContent: "center",

              flexDirection: "row",
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
              Royal Cafeteria
            </Text>
            <TouchableOpacity onPress={() => alert("Shops Info Coming Soon")}>
              <AntDesign
                name="infocirlceo"
                color={"white"}
                size={one * 20}
                style={{
                  marginTop: one * 12,
                  marginLeft: one * 4,
                }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => alert("Search Function Coming Soon")}
          >
            <Icon
              name="ios-search"
              color={"white"}
              size={one * 32}
              style={{
                marginTop: one * 6,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: screenHeight * 0.04,
            width: "100%",
            backgroundColor: "#990849",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderBottomColor: "#ed0971",
            borderBottomWidth: one,
          }}
        >
          <FlatList
            horizontal={true}
            style={{ height: "100%" }}
            showsHorizontalScrollIndicator={false}
            data={this.state.StoreShelvesTop}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("shopWithTabs", {
                      selectedCategory: item.CategoryName,
                      StoreName: this.state.StoreName,
                      StoreLocation: this.state.StoreLocation,
                      StoreShelvesTop: this.state.StoreShelvesTop,
                    })
                  }
                  style={{ height: "100%", justifyContent: "center" }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: one * 15,
                      fontWeight: "900",
                      marginHorizontal: one * 12,
                    }}
                  >
                    {item.CategoryName}
                  </Text>
                </TouchableOpacity>
              );
            }}
          ></FlatList>
        </View>
        <Modal
          ref={"deleteItemWarningModal"}
          style={{
            justifyContent: "center",
            borderRadius: Platform.OS === "ios" ? one * 30 : 0,
            shadowRadius: one * 10,
            width: screen.width - 50,
            height: one * 200,
            backgroundColor: "#990849",
            marginBottom: one * 20,
          }}
          position="center"
          backdrop={true}
          onClosed={() => {
            this.setState({ leaveShopModalIsOpen: false });
          }}
          onOpened={() => {
            this.setState({ leaveShopModalIsOpen: true });
          }}
        >
          <TouchableOpacity
            onPress={() => this.refs.deleteItemWarningModal.close()}
            style={{
              //alignSelf: 'flex-end',
              position: "absolute",
              top: 0,
              right: 0,
              //: one*260,
              //bottom: one*1,
              backgroundColor: "red",
              height: screenHeight * 0.035,
              width: screenHeight * 0.039,
            }}
          >
            <AntDesign name="close" size={one * 25} color="white" />
          </TouchableOpacity>
          <Text
            style={{
              color: "white",
              fontSize: one * 16,
              fontWeight: "800",
              textAlign: "center",
              marginBottom: one * 10,
            }}
          >
            ARE YOU COMING BACK SOON?
          </Text>
          <Text
            style={{
              color: "white",
              //height: 20,
              alignSelf: "center",
              marginHorizontal: one * 30,
              fontSize: one * 15,
            }}
          >
            Should we keep the items on your cart or remove them?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              style={{ fontSize: one * 19, color: "white", fontWeight: "bold" }}
              containerStyle={{
                padding: one * 8,
                //marginLeft: one*10,
                height: one * 40,
                borderRadius: one * 6,
                backgroundColor: "#ed6fa8",
                marginTop: one * 30,
                width: "40%",
              }}
              onPress={() => {
                this.refs.deleteItemWarningModal.close();
                this.props.navigation.goBack();
              }}
            >
              KEEP
            </Button>
            <Button
              style={{ fontSize: one * 17, color: "white", fontWeight: "bold" }}
              containerStyle={{
                padding: one * 8,
                marginLeft: one * 10,
                height: one * 40,
                borderRadius: one * 6,
                backgroundColor: "#ed6fa8",
                marginTop: one * 30,
                width: "40%",
              }}
              onPress={() =>
                this.props.navigation.navigate("clearCartShop", {
                  products: this.state.products,
                  StoreName: this.state.StoreName,
                  StoreLocation: this.state.StoreLocation,
                })
              }
            >
              REMOVE
            </Button>
          </View>
        </Modal>
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
                                  item.productCatagory,
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
                                  item.productCatagory,
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
                                item.productCatagory,
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
                                item.productCatagory,
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
            paddingBottom: shopPaddingBottom,
            height: "90%",
          }}
        >
          <FlatList
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            data={this.state.StoreShelves}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("categoryProducts", {
                        selectedCategory: item.CategoryName,
                        StoreName: this.state.StoreName,
                        StoreLocation: this.state.StoreLocation,
                      })
                    }
                    style={{ width: "100%", justifyContent: "flex-end" }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "300",
                        fontSize: one * 18,
                        marginLeft: one * 7,
                      }}
                    >
                      {item.CategoryName}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#e3dadd",
                      marginTop: one * 1,
                      marginLeft: one * 4,
                      paddingRight: one * 5,
                    }}
                  >
                    <FlatList
                      horizontal={true}
                      ref={"storesHome"}
                      data={item.catagoryProducts}
                      renderItem={({ item, index }) => {
                        return (
                          <View
                            style={{
                              height: screenHeight * 0.37,
                              width: screenHeight * 0.31,
                              marginBottom: one,
                              marginHorizontal: one * 5,
                            }}
                          >
                            <TouchableOpacity
                              // onPress={() => {
                              //   this.loadLocally(
                              //     item.productCatagory,
                              //     item.key
                              //   );
                              // }}
                              style={{
                                justifyContent: "center",
                                alignContent: "center",
                                height: "70%",
                                width: "100%",
                                backgroundColor: "white",
                              }}
                            >
                              <Image
                                source={{ uri: item.productImage }}
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  alignSelf: "center",
                                }}
                                resizeMode="contain"
                              ></Image>
                            </TouchableOpacity>
                            <View
                              style={{
                                backgroundColor: "white",
                                height: "30%",
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
                                    width: "35%",
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
                                    width: "65%",
                                    backgroundColor: "white",
                                    padding: one * 2,
                                  }}
                                >
                                  <ScrollView>
                                    <Text
                                      //numberOfLines={2}
                                      style={{
                                        color: "black",
                                        fontSize: one * 15,
                                        fontWeight: "500",
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
                                  justifyContent: "center",
                                  flexDirection: "row",
                                  marginBottom: one * 2,
                                }}
                              >
                                {item.bgColor === "red" ? (
                                  <View
                                    style={{
                                      height: "100%",
                                      width: "58%",
                                      backgroundColor: "white",
                                      justifyContent: "center",
                                      flexDirection: "row",
                                      marginLeft: one * 2,
                                      flexDirection: "row",
                                    }}
                                  >
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.onPressMinus(
                                          item.productDecription,
                                          item.productPrice,
                                          item.productCatagory,
                                          item.Quantity
                                        );
                                      }}
                                      style={{
                                        height: "100%",
                                        width: "33.33%",
                                        //backgroundColor: "green",
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
                                        //backgroundColor: "red",
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
                                          item.productCatagory,
                                          item.Quantity
                                        );
                                      }}
                                      style={{
                                        height: "100%",
                                        width: "33.33%",
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
                                    onPress={() => {
                                      this.onPressAddToCart(
                                        item.productDecription,
                                        item.productPrice,
                                        item.productImage,
                                        item.productCatagory,
                                        item.subCatagory
                                      );
                                    }}
                                    style={{
                                      height: "100%",
                                      width: "58%",
                                      backgroundColor: "#ed0971",
                                      justifyContent: "center",
                                      flexDirection: "row",
                                      marginLeft: one * 2,
                                    }}
                                  >
                                    <Icon
                                      name="md-cart"
                                      style={{
                                        color: "white",
                                        alignSelf: "center",
                                      }}
                                      size={one * 28}
                                    />
                                    <Text
                                      style={{
                                        color: "white",
                                        fontSize: one * 15,
                                        fontWeight: "bold",
                                        alignSelf: "center",
                                      }}
                                    >
                                      ADD TO CART
                                    </Text>
                                  </TouchableOpacity>
                                )}
                                {item.favourateIconName ===
                                "md-star-outline" ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.onPressRemoveFavourate(
                                        item.productDecription,
                                        item.productCatagory
                                      );
                                    }}
                                    style={{
                                      height: "100%",
                                      width: "20%",
                                      backgroundColor: "white",
                                      justifyContent: "center",
                                      marginBottom: one * 15,
                                    }}
                                  >
                                    <Icon
                                      name="md-star"
                                      color={"#851337"}
                                      size={one * 35}
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
                                        item.productCatagory,
                                        item.subCatagory
                                      );
                                    }}
                                    style={{
                                      height: "100%",
                                      width: "20%",
                                      backgroundColor: "white",
                                      justifyContent: "center",
                                      marginBottom: one * 15,
                                    }}
                                  >
                                    <Icon
                                      name="md-star-outline"
                                      color={"#851337"}
                                      size={one * 35}
                                      style={{
                                        alignSelf: "center",
                                      }}
                                    />
                                  </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                  onPress={() =>
                                    this.onPressMoreItems(
                                      item.productDecription,
                                      item.productCatagory
                                    )
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
                                      width: "55%",
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
                </View>
              );
            }}
          ></FlatList>
        </View>
        {ShoppingCart}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3dadd",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
  },
});

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;
