import React,{useState} from 'react';
import { StyleSheet, View, Button, Text} from 'react-native';
import * as Location from "expo-location";
import Home from './components/Home/Home';
export default function App() {
     return (
          <View style={styles.container}>
              <Home/>
          </View>
     );
}
const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
     },
 });
 
