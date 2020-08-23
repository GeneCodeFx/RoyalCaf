import { createSwitchNavigator, createAppContainer } from "react-navigation";

import Loading from "./src/authScreens/Loading";
import RoyalCafe from "./src/authScreens/RoyalCafe";
import SignUpPage from "./src/authScreens/SignUpPage";
import LoginScreen from "./src/authScreens/LoginScreen";
import UserInfo from "./src/authScreens/UserInfo";
import saveUser from "./src/authScreens/saveUser";
import storeUserData from "./src/authScreens/storeUserData";
import error from "./src/authScreens/error";
import App from "./src/junkCode/animations";

export default createAppContainer(
  createSwitchNavigator(
    {
      RoyalCafe,
      LoginScreen,
      SignUpPage,
      Loading,
      UserInfo,
      saveUser,
      storeUserData: storeUserData,
      error: error,
      App,
    },
    {
      initialRouteName: "App",
    }
  )
);
