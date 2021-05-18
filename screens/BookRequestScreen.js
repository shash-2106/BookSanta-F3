import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../Component/MyHeader'
import {BookSearch} from 'react-native-google-books'
import { FlatList } from 'react-native';
import { TouchableHighlight } from 'react-native';

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive:"",
      requestedBookName:"",
      bookStatus:"",
      requestId:"",
      userDocId:"",
      docId:"",
      imageLink:"",
      dataSource:"",
      showFlatlist:false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

componentDidMount(){
  this.getBookRequest();
  this.getIsBookRequestActive();
 // var books = BookSearch.searchbook("Matilda","AIzaSyAYwz-U32IHUsEpmI1hyJZEE7AyefIgWH0");
  //console.log(books)
}
getBookRequest=()=>{
  var bookRequest = db.collection("requested_books").where("userId","==",this.state.userId).get().then((snapshot)=>{snapshot.forEach((doc)=>{
    if(doc.data().book_status!="received"){
      alert(doc.id)
      alert(doc.data().book_name)
      this.setState({
        requestId:doc.data().request_id,
        requestedBookName:doc.data().book_name,
        bookStatus:doc.data().book_status,
        docId:doc.id
      })
    }})})
}
getIsBookRequestActive=()=>{
  db.collection("users").where("email_id","==",this.state.userId).onSnapshot((snapshot)=>{snapshot.forEach((doc)=>{this.setState({
    isBookRequestActive:doc.data().isBookRequestActive,
    userDocId:doc.id
  })})})
}

  addRequest = async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "book_status":"requested",
        "date":firebase.firestore.FieldValue.serverTimestamp()
    })
    await this.getBookRequest()
      db.collection("users").where("email_id","==",userId).get().then().then((snapshot)=>{
        snapshot.forEach((doc)=>{db.collection("users").doc(doc.id).update({
          isBookRequestActive:true
        })})
      })
    

    this.setState({
        bookName :'',
        reasonToRequest : '',
        requestId:randomRequestId
    })

    return Alert.alert("Book Requested Successfully")
  }
sendNotification=()=>{
  db.collection("users").where("email_id","==",this.state.userId).get().then((snapshot)=>{snapshot.forEach((doc)=>{
    var name = doc.data().first_Name
    var lastName = doc.data().last_Name
    db.collection("all_notifications").where("request_id","==",this.state.requestId).get().then((snapshot)=>{snapshot.forEach((doc)=>{
 var donorId = doc.data().donor_id
 var bookName = doc.data().book_name
 db.collection("all_notifications").add({
   "targeted_user_id":donorId,
   "message":name + " " + lastName + "received the book" + bookName,
   "notification_status":"unread",
   "book_Name":bookName  
 })
    })     
    })
  })})
}
updateBookRequestStatus=()=>{
  alert(this.state.docId)
db.collection("requested_books").doc(this.state.docId).update({
  book_status:"received",

})
db.collection("users").where("email_id","==",this.state.userId).get().then((snapshot)=>{snapshot.forEach((doc)=>{
  db.collection("users").doc(doc.id).update({
    isBookRequestActive:false
  })
})})
}
receivedBooks=(bookName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection("received_books").add({
    "user_id":userId,
    "book_name":bookName,
    "request_id":requestId,
    "bookStatus":"received"
  })
}
async getBooksFromAPI(bookName){
  this.setState({
    bookName:bookName
  })
  if(bookName.length>2){

  
  var books = await BookSearch.searchbook(bookName,"AIzaSyCEeB18sGQL-fMq2Lzhb7a9ycAyXo0yyYg");
  console.log(books)
  this.setState({
    dataSource:books.data,
    showFlatlist:true
  })
}
}
renderItem=({item,i})=>{
  return(
    <TouchableHighlight style={{alignItems:'center', backGroundColor:'blue',padding:10,width:'90%'}} activeOpacity={0.6} underlayColor={'black'} onPress={()=>{this.setState({
      showFlatlist:false,
      bookName:item.volumeInfo.title,
    })}} bottomDivider><Text>{item.volumeInfo.title}</Text>
    </TouchableHighlight>
  )
}
  render(){
    if(this.state.isBookRequestActive==true){
      return(
        <View style={{flex:1, justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity onPress={()=>{this.sendNotification()
          this.updateBookRequestStatus()
         // this.receivedBooks(this.state.requestedBookName)
          }}>
            <Text>I received the book</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
    return(
        <View style={{flex:1}}>
          <MyHeader navigation={this.props.navigation} title="Request Book"/>
          <View>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.getBooksFromAPI(text)
                }}
                onClear={(text)=>{this.getBooksFromAPI("")}}
                value={this.state.bookName}
              />
              {this.state.showFlatlist?(
                <FlatList data={this.state.dataSource} renderItem={this.renderItem} enableEmptySections={true} 
                style={{marginTop:10}} keyExtractor={(item,index)=>index.toString()}></FlatList>
              ):(
              <View>
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
             
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
              </View>
              )}
        </View>
        </View>
    )
              }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)