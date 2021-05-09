
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import CustomSidebarMenu from './CustomSidebarMenu';
import {AppTabNavigator} from './TabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyDonations from '../screens/MyDonationScreen';
import MyNotifications from '../screens/MyNotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{screen:AppTabNavigator},
Settings:{screen:SettingScreen},
MyDonations:{screen:MyDonations},
MyNotifications:{screen:MyNotifications}},

    
    {contentComponent:CustomSidebarMenu},
    {initialRouteName:'Home'

}) 