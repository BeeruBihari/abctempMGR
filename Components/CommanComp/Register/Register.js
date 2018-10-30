import React from 'react';
import { StyleSheet, Text, View ,ScrollView,Button,Image,TextInput,KeyboardAvoidingView} from 'react-native';


import TakeEmail from './TakeEmail';

import VerifyOTP from './VerifyOTP';
let a = 1;
export default class Register extends React.Component {
  render() {
        //alert("reder");
        if(a == 1){
            return(<TakeEmail/>);

        }else if(a == 2){
            return(<TakePhone/>);
        }else{
            return(<VerifyOTP/>);
        }
  }
}

class TakePhone extends React.Component {
    emailDone = () =>{
        a = 2;
        alert("email done");    
        
    }
    render() {
      return (
          <KeyboardAvoidingView behavior="padding" enabled>
              <View style={styles.parentContainer}>
                  <View style={styles.container}>
                      <Image style={styles.image} source={require('../pic/logo.png')} />            
                      <TextInput 
                          underlineColorAndroid='#b3b3b3' 
                          style={styles.textInput} 
                          placeholder="Enter your phone no."
                          keyboardType="phone-pad"
                      />
                      <Button style = {styles.button} title="Let's GO" onPress={() =>{  alert("hels"); }}></Button>
                  </View>
              </View>
          </KeyboardAvoidingView>
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
  
  
  
  