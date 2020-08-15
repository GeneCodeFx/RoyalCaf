import React from "react";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import Sidebar from "../mainScreens/Sidebar";
import Settings from "../mainScreens/Settings";
import Profile from "../mainScreens/Profile";
import Home from "../mainScreens/Home";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    Profile: { screen: Profile },
    Settings: { screen: Settings },
  },
  {
    initialRouteName: "Home",
    unmountInactiveRoutes: true,
    headerMode: "none",
    contentComponent: (props) => <Sidebar {...props} />,
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none",
    unmountInactiveRoutes: true,
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class RoyalCafe extends React.Component {
  render() {
    return <AppContainer />;
  }
}
