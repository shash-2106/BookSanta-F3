
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import WelcomeScreen from './screens/WelcomeScreen';
import {createAppContainer,createSwitchNavigator} from 'react-navigation'; 
import {AppDrawerNavigator} from './Component/DrawerNavigator';

export default class App extends React.Component {
  render(){
  return (
   
    
     <AppContainer/>
   
  );
}
}
const SwitchNavigator = createSwitchNavigator({WelcomeScreen:{screen:WelcomeScreen},DrawerTab:{screen:AppDrawerNavigator}})
const AppContainer = createAppContainer(SwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
