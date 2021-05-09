import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import MyHeader from '../Component/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {Header, Icon, Card} from 'react-native-elements';

export default class ReceiverDetailsScreens extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            userName:'',
            receiverId:this.props.navigation.getParam("details")["user_id"],
            requestId:this.props.navigation.getParam("details")["request_id"],
            bookName:this.props.navigation.getParam("details")["book_name"],
            reason_for_requesting:this.props.navigation.getParam("details")["reason_to_request"],
            receiverName:'',
            receiverContact:'',
            receiverAddress:''
        }
    }
    componentDidMount(){
      
        this.getReceiverDetails();
        this.getUserDetails(this.state.userId)
    }
    getUserDetails=(userId)=>{
        db.collection("users").where("email_id","==",userId).get().then(snapshot=>{snapshot.forEach(doc=>{this.setState({
         userName:doc.data().first_Name + " " + doc.data().last_Name
        })})})
    }
    getReceiverDetails=()=>{
        db.collection("users").where("email_id","==",this.state.receiverId).get().then(snapshot=>{snapshot.forEach(doc=>{this.setState({
            receiverName:doc.data().first_Name,
            receiverContact:doc.data().contact,
            receiverAddress:doc.data().address
        })})})
    }
    updateBookStatus=()=>{
        db.collection("all_donations").add({
            book_name:this.state.bookName,
            request_id:this.state.requestId,
            requested_by:this.state.receiverName,
            donor_id:this.state.userId,
            request_status:"Donor Interested"
        })
    }
    addNotifications=()=>{
        var message = this.state.userName + "has shown interest in donating the book";
        db.collection("all_notifications").add({
            "targeted_user_id":this.state.receiverId,
            "donor_id":this.state.userId,
            "request_id":this.state.requestId,
            "book_name":this.state.bookName,
            "date":firebase.firestore.FieldValue.serverTimestamp(),
            "notification_status":"unread",
            "message":message
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{flex:0.1}}>
            <Header leftComponent={<Icon name="arrow_left" type="feather" color="black" onPress={()=>{this.props.navigation.goBack()}}/>}
             centerComponent={{text:"Donate books"}} backgroundColor="grey"></Header>
                </View>
                <View>
                    <Card title="Book Information">
                        <Card><Text>Name:{this.state.bookName}</Text></Card>
                        <Card><Text>Reason:{this.state.reason_for_request}</Text></Card>
                    </Card>
                    
                </View>
                <View>
                    <Card title="Receiver Information">
                        <Card><Text>Name:{this.state.receiverName}</Text></Card>
                        <Card><Text>Contact:{this.state.receiverContact}</Text></Card>
                        <Card><Text>Address:{this.state.receiverAddress}</Text></Card>
                    </Card>
                    
                </View>
                <View style={styles.buttonContainer}>
                    {this.state.receiverId!=this.state.userId?(
                        <TouchableOpacity onPress={()=>{this.updateBookStatus()
                       this.addNotifications()
                       this.props.navigation.navigate("MyDonations");
                       }} style={styles.button}>
                            <Text>I want to donate</Text>
                            </TouchableOpacity>
                            ):null}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ container: { flex:1, }, buttonContainer : { flex:0.3, justifyContent:'center', alignItems:'center' }, button:{ width:200, height:50, justifyContent:'center', alignItems : 'center', borderRadius: 10, backgroundColor: 'orange', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation : 16 } })