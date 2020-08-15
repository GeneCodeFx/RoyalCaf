import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from "react-native";

export default class DropDownTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSlots: null,
    };
  }
  componentDidMount() {
    // const timeSlots = [];
    // //open time
    // let openHour = "7";
    // let openMinute = "30";
    // let openTime = `${openHour}:${openMinute}`;
    // //close time
    // let closeHour = "23";
    // let closeMinute = "00";
    // let closeTime = `${closeHour}:${closeMinute}`;
    // //Store's operating hours
    // let workingHours = `${openTime}-${closeTime}`;
    // //current time
    // const time = new Date();
    // let hourNow = time.getHours();
    // let minuteNow = time.getMinutes();
    // let currentTime = `${hourNow}:${minuteNow}`;
    // // && minuteNow > openMinute
    // if (hourNow > openHour) {
    //   var colors = ["red", "blue", "green"];
    //   for (let i = hourNow; i < closeHour; i++) {
    //     //First window
    //     let slot1 = `${i}: 00`;
    //     let slot2 = `${i}: 30`;
    //     let firstWindow = `${slot1} - ${slot2}`;
    //     //Second window
    //     let slotA = slot2;
    //     let slotB = `${i + 1}: 00`;
    //     let secondWindow = `${slotA} - ${slotB}`;
    //     timeSlots.push({
    //       timeSlot: firstWindow,
    //     });
    //     timeSlots.push({
    //       timeSlot: secondWindow,
    //     });
    //     //console.log(timeSlots);
    //   }
    //   console.log(`Time now is:${currentTime} `);
    //   console.log(`workingHours are: ${workingHours}`);
    // } else {
    //   console.log("Time has passed");
    // }
    // this.setState({ timeSlots: timeSlots });
  }
  render() {
    if (this.props.show) {
      const { y: top, x: left } = this.props.position;
      const width = 100;
      const hour = new Date().getHours();

      return (
        <TouchableWithoutFeedback
          onPress={() => this.props.clear("background pressed")}
        >
          <View style={styles.container}>
            <View style={[styles.menu, { top, left: left - width / 2, width }]}>
              <FlatList
                keyExtractor={(item) => item.timeSlot}
                data={this.state.timeSlots}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={{ width, alignItems: "center", paddingTop: 5 }}
                      onPress={() => this.props.hide(item.timeSlot)}
                    >
                      <Text>{item.timeSlot}</Text>
                    </TouchableOpacity>
                  );
                }}
              ></FlatList>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 13,
    left: 0,
    right: 0,
    //bottom: 300,
    //height: 10,
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
});
