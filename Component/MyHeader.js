
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Header, Icon, Badge} from 'react-native-elements';
import db from '../config';

export default class MyHeader extends React.Component{
    constructor(props){
        super();
        this.state={
            value:0
        }
    }
    getNumberOfUnreadNotofications(){
        db.collection("all_notifications").where("notification_status","==","unread")
        .onSnapshot((snapshot)=>{var unreadNotifications=snapshot.docs.map((doc)=>doc.data() )
            this.setState({
                value:unreadNotifications.length
            })
        })
    }
    componentDidMount(){
        this.getNumberOfUnreadNotofications()
    }
bellIconWithBadge=()=>{
    return(
        <View>
            <Icon name="bell" type="font-awesome" color='black' size={25} onPress={()=>{this.props.navigation.navigate("MyNotifications")}}> </Icon>
                <Badge value={this.state.value} containerStyle={{position:'absolute',top:-4,right:-4}}></Badge>
           
        </View>
    )
}
    render(){
        return(

            <Header rightComponent={<this.bellIconWithBadge{...this.props}/>} leftComponent={<Icon name="bars" type="font-awesome" color='black' onPress={()=>{this.props.navigation.toggleDrawer()}}></Icon>} centerComponent={{text:this.props.title, style:{color:"white", fontSize:20, fontWeight:'bold'}}} backgroundColor='#4d0000'/>
        )  
    }

}