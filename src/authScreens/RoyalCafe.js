import React from "react";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import Sidebar from "../mainScreens/Sidebar";
import Settings from "../mainScreens/Settings";
import Profile from "../mainScreens/Profile";
import Home from "../mainScreens/Home";

import categoryProducts from "../shoppingScreens/categoryProducts";
import CheckOut from "../shoppingScreens/CheckOut";
import clearCartShop from "../shoppingScreens/clearCartShop";
import clearCartView from "../shoppingScreens/clearCartView";
import orderSuccessful from "../shoppingScreens/orderSuccessful";
import shopWithTabs from "../shoppingScreens/shopWithTabs";
import viewCart from "../shoppingScreens/viewCart";

const Drawer = createDrawerNavigator(
  {
    Home: Home,
    Profile: Profile,
    Settings: Settings,
    categoryProducts: categoryProducts,
    CheckOut: CheckOut,
    clearCartShop: clearCartShop,
    clearCartView: clearCartView,
    orderSuccessful: orderSuccessful,
    viewCart: viewCart,
    shopWithTabs: shopWithTabs,
  },
  {
    initialRouteName: "Home",
    unmountInactiveRoutes: false,
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
