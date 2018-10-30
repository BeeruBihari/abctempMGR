import React from 'react';
import { StyleSheet, Text, View ,ActivityIndicator,ScrollView,Button,Image,TextInput,KeyboardAvoidingView,TouchableOpacity,AsyncStorage} from 'react-native';

import {createDrawerNavigator,createSwitchNavigator} from 'react-navigation';

import "../pic/logo.png";
import MyProfileRegister from './MyProfile';


class VerifyOTPScreen extends React.Component {
    constructor(props){
        super(props); 
        this.state = {
           submitButtonDisable:false,
           reSendOTP:false,
           email:"aarav@gmail.com",
           phone:"9102163686",
           sentOTP:"",// OTP has been sent by system
           enteredOTP:"",//OTP has been entered 
           
        }
        
    }
    componentDidMount(){
        this._retrieveData();
        setTimeout(this.ReSendOTP,2000);
        
    }
    _retrieveData = async () => {
        console.log("Retruive data");
        try {

            const register_email = await AsyncStorage.getItem('register_email');
            const register_phone_no = await AsyncStorage .getItem('register_phone_no');
            console.log("regi:"+register_email+" regste phone no :"+register_phone_no);
            this.setState({
                email:register_email,
                phone:register_phone_no,
            });
        } catch (error) {
            console.log("Data not retriving....",error);
        }
      }
    ReSendOTP = () => {
        let newOTP = parseInt(Math.random()*1000000);
        //alert(newOTP);
        this.setState({
            sentOTP:newOTP,
        });
        this.sendOTPToEmail(newOTP);
    }
    sendOTP = () =>{
        let newOTP = parseInt(Math.random()*1000000);
        //alert(newOTP);
        this.setState({
            sentOTP:newOTP,
        });
        this.sendOTPToEmail(newOTP);
        //alert("OTP Sent! Check Your Email Address and Verify Email")
    }
    sendOTPToEmail = (newOTP) =>{
        
        let message = "Use this OTP to register your account on MarketGo. Your OTP is:"+newOTP;
        console.log(message);
        fetch('http://biharilegends.com/biharilegends.com/market_go/mail/send_mail.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mail_to: this.state.email,
                        mail_sub:"Verification OTP",
                        mail_msg:message
                    }) 
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            if(responseJson == "Mail Sent")
                            alert("Check Email For OTP. Also in spam folder !!!"); 
                           
        
                        }).catch((error) => {
                            alert("error in sending email ");
                            console.log(error);
                            
        
                        });
    }
    verifyEmailOTP = () =>{
        this.setState({
            submitButtonDisable:true,
        });
        if(this.state.sentOTP == this.state.enteredOTP){
            let sql = "INSERT INTO `security_table`( `email`, `phone_no`,`password`, `user_type`) VALUES ('"+this.state.email+"','"+this.state.phone+"','"+this.state.phone+"','shopkeeper');";
            //"INSERT INTO `shop_info_table`(`user_id`) VALUES ((SELECT user_id FROM security_table WHERE security_table.email = '"+this.state.email+"' and security_table.phone_no = '"+this.state.phone+"'))";
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
                        if(responseJson == "YES"){
                            this.props.navigation.navigate('MyProfileClass')
                            alert("Please Enter a new password");
                            
                        }
                        else {
                            alert("Opps!! Something looks wrong.Please Report to developer.")
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


            

        }else{
            alert("Invalid OTP!!!");
            this.setState({
                submitButtonDisable:false,
            });
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
                        keyboardType='numeric' 
                        style={styles.textInput} 
                        placeholder="Enter OTP"
                        maxLength = {6}
                        onChangeText = {(text)=>{this.setState({enteredOTP:text});}}
                    />
                    <Button 
                        style = {styles.button} 
                        title="Verify ME" 
                        onPress={()=>{this.verifyEmailOTP()}}
                        disabled = {this.state.submitButtonDisable}
                    ></Button>
                    <ActivityIndicator 
                            style = {{ opacity : this.state.submitButtonDisable ? 1 : 0 }} 
                            size="large" 
                            color="#00ff00" />
                    
                    <TouchableOpacity disabled={this.state.reSendOTP} onPress={()=>{  this.ReSendOTP()}}>
                        <Text style={styles.H5}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
  }
}



class MyProfileClass extends React.Component{
    render(){
        return(<MyProfileRegister/>)
    }
}

const RootStack = createSwitchNavigator(
    {
        MyProfileClass:MyProfileClass,
        VerifyOTPScreen:VerifyOTPScreen
    },
    {
        initialRouteName: 'VerifyOTPScreen',
        backBehavior:'initialRoute',
       
      }
    
);

export default class VerifyOTP extends React.Component{
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
        
    },
    H5:{
        marginTop: '15%',
        fontSize: 13,
        fontWeight: '800',
        color: "#0c68a9",
        textAlign: 'center', 
        marginBottom: 15
    },
});



