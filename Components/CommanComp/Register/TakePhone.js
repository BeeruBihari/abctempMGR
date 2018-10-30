import React from 'react';
import { StyleSheet, ActivityIndicator,Text, View ,ScrollView,Button,Image,TextInput,KeyboardAvoidingView,AsyncStorage} from 'react-native';
import {createDrawerNavigator,createSwitchNavigator} from 'react-navigation';


import "../../Image/logo.png";
import VerifyOTP from './VerifyOTP';
class TakePhoneScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           phoneNo:"",
           submitButtonDisable:false,
        }
    }
    validatephoneNo = (phoneNo) => {
        var re =  /^\d{10}$/;
        return re.test(phoneNo);
      }
      
    checkphoneNoAndGo = () =>{
        if(this.state.phoneNo.trim().length == 0 ){
            alert("Enter 10 Digit phoneNo first!");
            return;
        }
        if(!this.validatephoneNo(this.state.phoneNo.trim())){
            alert("Invalid phoneNo! Should Be of 10 Digit!!!");
            return;
        }
        this.setState({
            submitButtonDisable:true
        });
        let sql = 'SELECT * FROM `security_table` WHERE phone_no = "'+this.state.phoneNo+'"';
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
                        alert("This phoneNo is already Registered! Try another one.")
                        this.setState({
                            submitButtonDisable:false
                        });
                        
                    }
                    else if(responseJson.length == 0){
                        this._storeData();
                        this.props.navigation.navigate('VerifyOTPClass');
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
            await AsyncStorage.setItem('register_phone_no',this.state.phoneNo);
              console.log("saved phone no ");
            let val = await AsyncStorage.getItem('register_phone_no');
            console.log("retrived data pheone no::"+val);

          }catch (error) {
              console.log("Eroor in saving");
          }
    }
  render() {
    return (
        <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.parentContainer}>
                <View style={styles.container}>
                    <Image style={styles.image} source={require('../../Image/logo.png')} />            
                    <TextInput 
                        underlineColorAndroid='#b3b3b3' 
                        style={styles.textInput} 
                        placeholder="Enter your phone no."
                        keyboardType="numeric"
                        onChangeText={(text)=>{this.setState({phoneNo:text})}}  
                        maxLength = {10}  
                    />
                    <Button 
                        style = {styles.button} 
                        title="Let's GO" 
                        onPress={()=>{this.checkphoneNoAndGo()}}
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


class VerifyOTPClass extends React.Component{
    render(){
        return(<VerifyOTP/>)
    }
}

const RootStack = createSwitchNavigator(
    {
        VerifyOTPClass:VerifyOTPClass,
        TakePhoneScreen:TakePhoneScreen
    },
    {
        initialRouteName: 'TakePhoneScreen',
        backBehavior:'initialRoute',
       
      }
    
);

export default class TakePhone extends React.Component{
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



