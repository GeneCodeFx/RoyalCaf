import React, { Component } from "react";
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  Button,
  Easing,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  InteractionManager,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Ionicons";

var screen = Dimensions.get("window");
var screenHeight = Dimensions.get("window").height;
let screenWidth = Dimensions.get("window").width;
let one = screenHeight * 0.0015;

let position = new Animated.ValueXY({ x: 0, y: -50 });
let positionLogo = new Animated.ValueXY({ x: 0, y: 0 });
let signInButtonsPossition = new Animated.Value(0);
let positionLogoExit = new Animated.Value(0);
let emailSignInPosition = new Animated.Value(0);

const pan = PanResponder.create({
  onMoveShouldSetPanResponder: () => false,
  onPanResponderMove: (e, g) => {
    position.setValue({ x: g.dx, y: g.dy - 340 });
  },

  // Animated.event([
  //   null,
  //   {
  //     dx: position.x,
  //     dy: position.y,
  //   },
  // ]),
  onPanResponderRelease: () => {
    // position.setValue({ x: 0, y: 0 });
    Animated.spring(position, {
      useNativeDriver: true,
      toValue: { x: 0, y: -340 },
      easing: Easing.back(),
      bounciness: 20,
      speed: 5,
      //tension: 5,
    }).start();
  },
});
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  state = {
    signingInWithFacebook: false,
    signingInWithGoogle: false,
    signingInWithEmail: false,
    creatingNewAccount: false,
    showLogo: false,
    errorMessage: null,
    signInTranslateX: signInButtonsPossition,
  };

  componentDidMount() {
    setTimeout(() => {
      this.welcomeAnim();
    }, 1000);
  }
  welcomeAnim = () => {
    Animated.timing(position, {
      useNativeDriver: true,
      toValue: { x: 200, y: -340 },
      easing: Easing.back(),
      duration: 2000,
    }).start(this.animateLogo());
  };
  animateLogo = () => {
    Animated.timing(positionLogo, {
      useNativeDriver: true,
      toValue: { x: 1, y: 360 },
      easing: Easing.back(),
      duration: 2000,
    }).start();
  };
  undoAnimate = () => {
    Animated.spring(positionLogo, {
      useNativeDriver: true,
      toValue: { x: 0, y: 0 },
      easing: Easing.back(),
      bounciness: 15,
      speed: 5,
      //tension: 5,
    }).start();
  };

  leavePageAnim = () => {
    Animated.spring(position, {
      useNativeDriver: true,
      toValue: { x: 0, y: -50 },
      easing: Easing.back(),
      bounciness: 20,
      speed: 5,
      //tension: 5,
    }).start(this.undoAnimate());
  };
  focusInputWithKeyboard() {
    InteractionManager.runAfterInteractions(() => {
      this.inputRef.current.focus();
    });
  }

  handleEmailSignIn = () => {
    //Reveal Email and Password Inputs
    Animated.timing(position, {
      useNativeDriver: true,
      toValue: { x: 200, y: -600 },
      easing: Easing.back(),
      duration: 2000,
    }).start();
    //Logo must follow along
    Animated.timing(positionLogoExit, {
      useNativeDriver: true,
      toValue: -300,
      easing: Easing.back(),
      duration: 2000,
    }).start(() => {
      //Side Out Email Sign In Button
      Animated.timing(emailSignInPosition, {
        useNativeDriver: true,
        toValue: 400,
        duration: 900,
      }).start(() => {
        //Slide In The Log in button

        this.setState({ signingInWithEmail: true });

        Animated.timing(emailSignInPosition, {
          useNativeDriver: true,
          toValue: 0,
          //delay: 500,
          duration: 900,
        }).start(() => {
          setTimeout(() => {
            this.focusInputWithKeyboard();
          }, 800);
        });
      });
    });
  };

  animateLogoLoading = () => {
    Animated.timing(positionLogo, {
      useNativeDriver: true,
      toValue: { x: 1, y: 39000 },
      //easing: Easing.back(),
      duration: 15000,
    }).start(() => {
      Animated.timing(positionLogo, {
        useNativeDriver: true,
        toValue: { x: 1, y: 360 },
        duration: 15000,
        //easing: Easing.back(),
      }).start(this.animateLogoLoading);
    });
  };

  handMasterSignIn = () => {
    Animated.timing(signInButtonsPossition, {
      useNativeDriver: true,
      toValue: 350,
      easing: Easing.back(),
      duration: 2000,
    }).start(this.animateLogoLoading);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Animated.View
          {...pan.panHandlers}
          style={{
            //backgroundColor: "white",
            width: "99.5%",
            height: "110%",
            elevation: 2,
            borderWidth: 0.2,
            position: "absolute",
            borderBottomStartRadius: 200,
            borderBottomEndRadius: 200,
            overflow: "hidden",
            transform: [
              // {
              //   translateX: position.x,
              // },
              {
                translateY: position.y,
              },
              { scaleX: 1.7 },
              // {
              //   rotate: position.x.interpolate({
              //     inputRange: [0, 20],
              //     outputRange: ["0deg", "360deg"],
              //   }),
              // },
            ],
          }}
        >
          <ImageBackground
            source={{
              uri: "https://cdn.hipwallpaper.com/i/58/92/aHGfh5.jpg",
            }}
            //resizeMode="repeat"
            imageStyle={{
              opacity: 1,
              width: "100%",
              height: "100%",
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              //backgroundColor: "#5c052c",
              //flexDirection: "row",
            }}
          ></ImageBackground>
        </Animated.View>

        {this.state.showLogo ? null : (
          <Animated.View
            style={{
              width: 150,
              height: 150,
              position: "absolute",
              top: 85,
              elevation: 3,
              transform: [
                {
                  translateY: positionLogoExit,
                },
                {
                  rotate: positionLogo.y.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
              opacity: positionLogo.x,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 150,
                borderWidth: 1,
              }}
              resizeMode="contain"
              source={require("../../assets/images/WQLogo.jpg")}
            ></Image>
          </Animated.View>
        )}
        <View
          style={{
            backgroundColor: "#6e0534",
            position: "absolute",
            width: "95%",
            height: one * 240,
            top: 50,
            elevation: 1,
          }}
        >
          <View
            style={{
              height: "15%",
              //backgroundColor: "blue",
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
              WELCOME BACK TO WHICHQ
            </Text>
          </View>
          <View
            style={{
              height: "55%",
              //backgroundColor: "red",
            }}
          >
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
                ref={this.inputRef}
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
          </View>
          <View
            style={{
              height: "30%",
              //justifyContent: "center",
              //backgroundColor: "black",
            }}
          >
            {this.state.errorMessage && (
              <Text
                style={{
                  marginHorizontal: one * 5,
                  color: "white",
                  backgroundColor: "red",
                  fontSize: one * 15,
                }}
              >
                {this.state.errorMessage}
              </Text>
            )}
            <Text
              style={{
                fontSize: one * 15,
                color: "red",
                marginLeft: one * 10,
                marginTop: one * 5,
                fontStyle: "italic",
                //alignSelf: "center",
                //fontWeight: "700",
              }}
            >
              I forgot my password
            </Text>
          </View>
        </View>
        {this.state.signingInWithEmail ? (
          <AnimatedTouchable
            style={[
              styles.buttonStyle,
              {
                backgroundColor: "red",
                elevation: 3,
                top: 265,
                transform: [
                  {
                    translateX: emailSignInPosition,
                  },
                ],
              },
            ]}
          >
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: one * 20 }}
            >
              LOG IN
            </Text>
          </AnimatedTouchable>
        ) : (
          <AnimatedTouchable
            onPress={() => {
              //this.setState({ translateX: emailSignInPosition });
              //emailSignInPosition = signInButtonsPossition;
              this.handleEmailSignIn();
            }}
            style={[
              styles.buttonStyle,
              ,
              {
                backgroundColor: "white",
                top: 350,
                transform: [
                  {
                    translateX: signInButtonsPossition,
                  },
                  // {
                  //   translateY: signInButtonsPossition.interpolate({
                  //     inputRange: [0, 100],
                  //     outputRange: [0, 200],
                  //   }),
                  // },
                ],
              },
            ]}
          >
            <Image
              style={styles.socialLogos}
              source={require("../../assets/images/WQLogo.jpg")}
            />
            <Text
              style={{ color: "black", fontWeight: "bold", fontSize: one * 20 }}
            >
              Sign In with Email
            </Text>
          </AnimatedTouchable>
        )}

        {this.state.signingInWithFacebook ? (
          <View
            style={[
              styles.buttonStyle,
              {
                backgroundColor: "#3b5abf",
                top: 400,
              },
            ]}
          >
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: one * 20 }}
            >
              Signing in with Facebook...
            </Text>
          </View>
        ) : (
          <AnimatedTouchable
            onPress={() => {
              this.setState({ signingInWithFacebook: true });
              this.handMasterSignIn();
            }}
            style={[
              styles.buttonStyle,
              {
                backgroundColor: "#3b5abf",
                top: 400,
                transform: [
                  {
                    translateX: signInButtonsPossition,
                  },
                  // {
                  //   translateY: position.y,
                  // },
                ],
              },
            ]}
          >
            <Image
              style={styles.socialLogos}
              source={{
                uri:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEU6VZ////81Up0yT5xgc61+jbsvTZyXo8hFXaOirM0nSJmlrs7O1OUkRpkfQ5c1UZ1oerKHlcDp6/M9WKHHzeHV2ulxgravt9Td4Ozl6PGDkb7ByN5YbatQZ6j29/q3v9h2hrhMY6aQnMSsAnKHAAAC70lEQVR4nO3caXLiMBRFYdoihhhsQ5jDlPT+F9mdqv7bRrYQ7z7XOQug9BUWHiQzmRARERERERERERERERERqVe0IZQPCtaDHFwo62Yz/VrP3jtbrH0Sy7rYH46/YtpV1oPtX6jCbBel+2npThjq/Taa51AYmrdTH583YdHsP/r5nAnLTa/j05+w+ezv8yRsq/MQoB9hmPeegb6E5eU2DOhFWK4G+rwIw3CgD2G4Dge6ELaboXPQi7CJu4nwK6zvKUAHwvCVBHQgrFMmoQdh4jGqL2wviUB5YRP/uMKnsJ2mAtWF9XLkwjblcs2FsDqMXZh6LpQXhn06UFtYpZ7t5YX1wEczboTF/AlAaWFYP0OovPZU9pmGt9194W79sIq/Jt2uqqrytwbcxJ4NT9e6tR7soEIk8N749E2K7zjgubEe6dAi75yOboGxwrnTQ/RvRZTwIHy6e1SccF5Yj3N4UcJjbT3MhKKEh9J6mAlFCZWvyR4WJXxDqBxChPohRKgfQoT6IUSoH0KE+iFEqB9ChPqNQ1h0vKJcxWwt/aofvelsDFzNOlpECO9dH/DT+8ZUWMYgErNdfXuB8Ga7RPwCofHy2wuE59EfpQvbH9MXCNejF65st2q8QPhtu5Mhv/BmfE2TX/hhvGMqv3BpvBslv/BuvGUqv3A2+nloff+YX3gx3rmYX2j9CCC78Ga9NzO78GS9dTG7cDv679B8c2Z24e/R/9LsRy+8Wm/kzy60nobZhdb3TvmF9u8e5hYaP0p8gfB99PPQ/l2F3MKp+StDuYXWvuxC60eJ+YXm907ZhQJ/NlA+4d9ZOrrbH6WTzbyjmL+D/Oz6BNsl/H8V/y9E7TYpOz7BGveoceyn6QohQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLUDyFC/RAi1A8hQv0QItQPIUL9ECLs0R8aFUYEFLSeAgAAAABJRU5ErkJggg==",
              }}
            />
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: one * 20 }}
            >
              Sign In with Facebook
            </Text>
          </AnimatedTouchable>
        )}
        {this.state.signingInWithGoogle ? (
          <View
            style={[
              styles.buttonStyle,
              {
                backgroundColor: "red",
                top: 450,
              },
            ]}
          >
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: one * 20 }}
            >
              Signing in with Google...
            </Text>
          </View>
        ) : (
          <AnimatedTouchable
            onPress={() => {
              this.setState({ signingInWithGoogle: true });
              this.handMasterSignIn();
            }}
            style={[
              styles.buttonStyle,
              ,
              {
                backgroundColor: "white",
                top: 450,
                transform: [
                  {
                    translateX: signInButtonsPossition.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, -200],
                    }),
                  },
                  // {
                  //   translateY: position.y,
                  // },
                ],
              },
            ]}
          >
            <Image
              style={styles.socialLogos}
              source={{
                uri:
                  "data:image/png;base64,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",
              }}
            />
            <Text
              style={{ color: "black", fontWeight: "bold", fontSize: one * 20 }}
            >
              Sign In with Google
            </Text>
          </AnimatedTouchable>
        )}

        {this.state.creatingNewAccount ? (
          <View
            style={[
              styles.buttonStyle,
              {
                backgroundColor: "black",
                top: 500,
              },
            ]}
          >
            <Text style={{ color: "white" }}>Creating a New Account...</Text>
          </View>
        ) : (
          <AnimatedTouchable
            onPress={() => {
              this.setState({ creatingNewAccount: true });
              this.handMasterSignIn();
            }}
            style={[
              styles.buttonStyle,
              ,
              {
                backgroundColor: "purple",
                top: 500,
                transform: [
                  {
                    translateX: signInButtonsPossition.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, -200],
                    }),
                  },
                  // {
                  //   translateY: position.y,
                  // },
                ],
              },
            ]}
          >
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: one * 20 }}
            >
              Sign Up for a New Account
            </Text>
          </AnimatedTouchable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5c052c",
    //flexDirection: "row",
  },

  leftRight: {
    height: "100%",
    width: "33.33%",
    //overflow: "hidden",
    //alignSelf: "flex-end",
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    backgroundColor: "white",
    //transform: [{ scaleX: 1.2 }],
    //marginTop: 50,
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    width: "95%",
    height: one * 48,
    position: "absolute",
    flexDirection: "row",
    borderRadius: one * 5,
  },
  socialLogos: {
    width: one * 30,
    height: one * 30,
    alignSelf: "center",
    marginRight: one * 30,
    borderRadius: one * 5,
  },
  fadingContainer: {
    backgroundColor: "red",
    width: 80,
    height: 80,
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
    margin: 10,
  },
  buttonRow: {
    alignSelf: "center",
    //flexDirection: "row",
    flex: 1,
  },
  inputview: {
    flexDirection: "row",
    paddingHorizontal: one * 10,
    alignContent: "center",
    justifyContent: "center",
    //marginBottom: 2,
    height: one * 60,
    marginHorizontal: one * 10,
    borderBottomColor: "white",
    borderBottomWidth: one,
  },

  icons: {
    width: "10%",
    alignSelf: "center",
  },

  inputxt: {
    fontSize: 18,
    height: "100%",
    width: "90%",
    //marginBottom: 3,
  },
});

export default App;
