import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BookDonateScreen from '../screens/BookDonateScreen';
import BookRequestScreen from '../screens/BookRequestScreen';
import {AppStackNavigator} from '../Component/AppStackNavigator';
export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks:{screen:AppStackNavigator},
    RequestBooks:{screen:BookRequestScreen}
})