import React from 'react';
import { StyleSheet, ActivityIndicator, View ,ScrollView,Button,Image,TextInput,KeyboardAvoidingView,AsyncStorage} from 'react-native';

import {createDrawerNavigator,createSwitchNavigator} from 'react-navigation';

import "../pic/logo.png";
import TakePhone from './TakePhone';
class VerifyEmail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           email:"",
           submitButtonDisable:false,
        }
    }
    validateEmail = (email) => {
        var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
      
    checkEmailAndGo = () =>{
        if(this.state.email.trim().length == 0 ){
            alert("Enter Email ID first!");
            return;
        }
        if(!this.validateEmail(this.state.email.trim())){
            alert("Invalid Email! Try again!!!");
            return;
        }
        this.setState({
            submitButtonDisable:true
        });
        let sql = 'SELECT * FROM `security_table` WHERE email = "'+this.state.email+'"';
        console.log(sql);
        fetch('http://biharilegends.com/biharilegends.com/market_go/run_query.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: sql, 
            }) 
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.length == 1){
                        alert("This email is already Registered! Try another one.")
                        this.setState({
                            submitButtonDisable:false
                        });
                    }
                    else if(responseJson.length == 0){
                        this._storeData();
                        this.props.navigation.navigate('RegPhoneNO');
                    }else{
                        alert("Something goes wrong contacnt to developer.")
                        this.setState({
                            submitButtonDisable:false
                        });
                    }
                        
                    

                }).catch((error) => {
                    alert("Something Went wrong");
                    console.log(error);
                    this.setState({
                        submitButtonDisable:false
                    });         

                });

    }
    _storeData = async () => {
        try {
            await AsyncStorage.setItem('register_email',this.state.email);
              console.log("saved");
          }catch (error) {
              console.log("Eroor in saving");
          }
    }
  render() {
    return (
        <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.parentContainer}>
                <View style={styles.container}>
                    <Image style={styles.image} source={require('../pic/logo.png')} />            
                    <TextInput 
                        underlineColorAndroid='#b3b3b3' 
                        keyboardType='email-address' 
                        style={styles.textInput} 
                        placeholder="Enter your email"
                        onChangeText = {(text)=>{this.setState({email:text})}}
                    />
                    <Button 
                        style = {styles.button} 
                        title="Let's GO" 
                        onPress={()=>{this.checkEmailAndGo()}}
                        disabled={this.state.submitButtonDisable}
                    ></Button>
                    <View style={styles.Process}>
                        <ActivityIndicator 
                            style = {{ opacity : this.state.submitButtonDisable ? 1 : 0 }} 
                            size="large" 
                            color="#00ff00" />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
  }
}


class RegPhone extends React.Component{
    render(){
        return(<TakePhone/>)
    }
}

const RootStack = createSwitchNavigator(
    {
        RegPhoneNO:RegPhone,
        VerifyEmail:VerifyEmail
    },
    {
        initialRouteName: 'VerifyEmail',
        backBehavior:'initialRoute',
       
      }
    
);

export default class TakeEmail extends React.Component{
    render(){
        return(
                <RootStack/>
        );
    }
}


const styles = StyleSheet.create({
    parentContainer:{
        
    },
    container:{
        
        backgroundColor: '#ffffff',
        
        
        alignSelf: 'center',
        justifyContent: 'center',
        
       
        //alignItems :'center'
    },
    textInput:{  
        textAlign: 'justify',
        marginBottom: 7,
        height: 40,
        //borderWidth: 1,
        // Set border Hex Color Code Here.
        borderColor: '#2196F3',
        
        // Set border Radius.
        borderRadius: 5 ,
        paddingLeft: 3,
        // Set border Radius.
        //borderRadius: 10 ,
    },
    
    image:{
        justifyContent: 'flex-start',
        alignSelf: 'center',
        margin: 55,
    },
   
    
    button:{
        marginTop: 50,
        
    }
});



