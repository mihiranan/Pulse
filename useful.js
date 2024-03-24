// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Text,
//   Dimensions,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import * as Location from "expo-location";
// import MapView, { Marker } from "react-native-maps";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// const Waiting_Driver_Screen = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [initialRegion, setInitialRegion] = useState(null);


//   return (
//     <View style={styles.container}>
//       {initialRegion && (
//         <MapView style={styles.map} initialRegion={initialRegion}>
//           {currentLocation && (
//             <Marker
//               coordinate={{
//                 latitude: currentLocation.latitude,
//                 longitude: currentLocation.longitude,
//               }}
//               title="Your Location"
//             />
//           )}
//      </MapView>
                 
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

// export default Waiting_Driver_Screen;
// const initialState = {
//      counter:0, 
//  }
//  const counterSlice = createSlice({
//       name: 'counter',
//       initialState,
//       reducers: {
//            increment: (state) => {
//                 state.counter += 1;
//            },
 
//       }
//  })
//  const store = configureStore({
//       reducer: counterSlice.reducer
//  })
      
//  function Counter() {
//       const counter = useSelector((state) => state.counter)
//       const dispatch = useDispatch();
//       return (
//            <View>
//                 <Text style={styles.text}>
//                      Counter: {counter}
//                 </Text>
//                 <Button
//                      title='Increment'
//                      onPress={() => dispatch(counterSlice.actions.increment())}
//                 />
//            </View>
//       )
//  }