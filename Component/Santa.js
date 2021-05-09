import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default class Santa extends React.Component{
    render(){
        return(
            <LottieView source={require('../assets/christmasBall.json')} style={{width:150,height:130}} autoPlay loop></LottieView>
        )
    }

} 