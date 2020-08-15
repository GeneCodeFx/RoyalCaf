import React from "react";
import { View, Dimensions, Image, StyleSheet, YellowBox } from "react-native";
import firebase from "firebase";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
console.ignoredYellowBox = ["Setting a timer"];

const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

var config = {
  apiKey: "AIzaSyCAhHMbnFiXsGua1HGIcWHusjlgdo76OMA",
  authDomain: "whichq-firebase.firebaseapp.com",
  databaseURL: "https://whichq-firebase.firebaseio.com",
  projectId: "whichq-firebase",
  storageBucket: "whichq-firebase.appspot.com",
  messagingSenderId: "864060974645",
  appId: "1:864060974645:web:ec3f13094bfea7fbe3f37c",
  measurementId: "G-JDTL6D727M",
};

firebase.initializeApp(config);

var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      Manager: false,
      Admin: false,
    };
    //console.ignoredYellowBox = ["Setting a timer"];
  }

  UNSAFE_componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .database()
          .ref("Management/")
          .on("value", (snapshot) => {
            const managers = [];
            snapshot.forEach((doc) => {
              managers.push(doc.toJSON().HeadID);
            });
            var isManager = managers.includes(firebase.auth().currentUser.uid);
            this.setState({ Manager: isManager });
            if (isManager === true) {
              //this.props.navigation.navigate("HeadHome");
              alert("The user is the Manager");
            } else if (
              firebase.auth().currentUser.uid === "EcoRdHBRM1eCqcj7s5sMNF4Eluo1"
            ) {
              //this.props.navigation.navigate("MasterHome");
              alert("I am the Master");
            } else {
              this.props.navigation.navigate("RoyalCafe");
            }
          });
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: screenHeight * 0.4, height: screenHeight * 0.4 }}
          source={require("../../assets/logo.png")}
        />
        <Image
          style={{ width: screenHeight * 0.15, height: screenHeight * 0.15 }}
          source={require("../../assets/gifs/load.gif")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
