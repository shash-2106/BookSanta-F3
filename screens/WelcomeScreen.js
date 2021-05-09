import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView,ScrollView } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../Component/MyHeader';
import Santa from '../Component/Santa';

export default class WelcomeScreen extends React.Component{
    constructor(){
        super();
        this.state={
            userName:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
            contact:'',
            confirmPassword:'',
            isModalVisible:false
        }
    }
   userLogin=(username,password)=>{
    firebase.auth().signInWithEmailAndPassword(username,password).then(()=>{this.props.navigation.navigate('DonateBooks')}).catch((error)=>{
        return alert(error.message);
    });
   }
   userSignUp=(username,password, confirm_password)=>{
       if(password!=confirm_password){
           alert("Passwords don't match");
       }
       else{
        firebase.auth().createUserWithEmailAndPassword(username,password).then((response)=>{db.collection("users").add({
            first_Name:this.state.firstName,
            last_Name:this.state.lastName,
            contact:this.state.contact,
            address:this.state.address,
            email_id:this.state.userName
        })
    return alert("user added successfully"," ", [{text:'ok', onPress:()=>{this.setState({
        isModalVisible:false
    })}}])
    })  
       }
   
 }
 showModal=()=>{
    return(
        
        <Modal animationType="fade" transparent={true} visible={this.state.isModalVisible}>
            <View>
                <ScrollView style={{width:'100%'}}>
                    <KeyboardAvoidingView >
                        <Text>Registration</Text>
                        <TextInput style={styles.textBox} placeholder={"First Name"} maxLength={8} onChangeText={(text)=>{this.setState({
                            firstName:text
                        })}}></TextInput>
                        <TextInput style={styles.textBox} placeholder={"Last Name"} maxLength={8} onChangeText={(text)=>{this.setState({
                            lastName:text
                        })}}></TextInput>
                        <TextInput style={styles.textBox} placeholder={"Contact"} maxLength={10} keyboardType={'numeric'} onChangeText={(text)=>{this.setState({
                            contact:text
                        })}}></TextInput>
                        <TextInput style={styles.textBox} placeholder={"Address"} multiline={true} onChangeText={(text)=>{this.setState({
                            address:text
                        })}}></TextInput>
                        <TextInput style={styles.textBox} placeholder={"Email address"} keyboardType={'email-address'} onChangeText={(text)=>{this.setState({
                            userName:text
                        })}}></TextInput>
                        <TextInput style={styles.textBox} placeholder={"Password"} secureTextEntry={true} onChangeText={(text)=>{this.setState({
                            password:text
                        })}}></TextInput>
                        <TextInput style={styles.textBox} placeholder={"Confirm password"} secureTextEntry={true} onChangeText={(text)=>{this.setState({
                           confirmPassword:text
                        })}}></TextInput>
                        <TouchableOpacity onPress={()=>{this.userSignUp(this.state.userName,this.state.password,this.state.confirmPassword)}}>
                            <Text >Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.setState({
                            isModalVisible:false
                        })}}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </Modal>
    )
 }
   
    render(){
        return(
            <View>
                 <MyHeader title="Book Santa"/>
     <Santa/>
                {this.showModal()}
            <TextInput
            style={styles.textBox}
            onChangeText={text=>{this.setState({userName:text})}}
            placeholder="Enter email address"
            keyboardType='email-address'
            ></TextInput>
             <TextInput
            style={styles.textBox}
            onChangeText={text=>{this.setState({password:text})}}
            placeholder="Enter password"
            secureTextEntry={true}
            ></TextInput>
            <TouchableOpacity style={styles.signUp} onPress={()=>{this.setState({
                isModalVisible:true
            })}}>
                <Text style={styles.text}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.login} onPress={()=>{this.userLogin(this.state.userName,this.state.password)}}>
                <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textBox:{
        width:'50%',
        height:30,
        backgroundColor:'#cc7722',
        borderWidth:3,
        alignContent:'center',
        justifyContent:'center',
        padding:5,
        borderRadius:5,
        margin:5
    },
    signUp:{
        width:'30%',
        height:30,
        backgroundColor:'#4d0000',
        alignContent:'center',
        justifyContent:'center',
        padding:5,
        borderRadius:5,
        margin:5
    },
    login:{
        width:'30%',
        height:30,
        backgroundColor:'#4d0000',
        alignContent:'center',
        justifyContent:'center',
        padding:5,
        borderRadius:5,
        margin:5
    },
    text:{
        color:'white'
    }
})