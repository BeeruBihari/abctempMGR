import React, { Component } from 'react';
import {
    AppRegistry,ScrollView,View,Button,TextInput,Picker,StyleSheet,Text,KeyboardAvoidingView,Platform
} from 'react-native';



export default class NewPassword extends Component{

    constructor(props) {
        super(props);
        this.state = {
            userType: 'student',
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
            submitButtonDisable:false,
            userid:'1',

        };
    }
    submitForm = () => {
        this.setState({submitButtonDisable:true});

        
        if(this.state.newPassword != this.state.confirmPassword){
            alert("Password not same");
        this.setState({submitButtonDisable:false});
            

            return;
        }
        if(this.state.newPassword == ""|| this.state.oldPassword == ""){
            alert("Blanck Password not valid");
            this.setState({submitButtonDisable:false});
            
            return;
        }
        this.featchOldPassword(); //and change it
        
    }
    //for freaching old pas
    featchOldPassword = () =>{
        


        
            fetch('https://3day.000webhostapp.com/run_query.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 'SELECT password FROM `security_table` WHERE id ='+this.state.userid,
            }) 
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson[0].password);
                    //alert("Data Received");
                    this.changePassword(responseJson[0].password);
                    return(responseJson[0].password);       
                }).catch((error) => {
                    console.error(error);
                });
        


    }
    changePassword = (featched_OldPassword) =>{
        if(this.state.oldPassword == featched_OldPassword){
            
            this.updatePassword(this.state.newPassword);
        }else{
            alert("Incorrent Old password");
        this.setState({submitButtonDisable:false});
            
            
            return;
        }
        
        
    }
    updatePassword = () =>{
        
        let sql = "UPDATE `security_table` SET `password`= '"+this.state.newPassword+"' WHERE `id` ="+this.state.userid;
        console.log(sql);
        fetch('https://3day.000webhostapp.com/run_query.php', {
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
                    console.log(responseJson[0].password);
                    alert("changed password successfully"); 
                    this.setState({submitButtonDisable:false});

                }).catch((error) => {
                    alert("updated slow network");
                    console.log(error);
                    this.setState({submitButtonDisable:false});

                });
    }
    render(){
        return(
            <KeyboardAvoidingView behavior="padding" enabled>
                <View style={styles.container}>
                    <View style={{margin:7}} />
                    <View style = {styles.MainConteiner}>
                        
                        
                        <View style = {styles.pickerParent}>
                            <Text>New Password:</Text>
                            <TextInput 
                                style = {styles.input} 
                                placeholder = "Enter New Password"
                                secureTextEntry = {true}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => this.setState({newPassword: text})}
                            />
                        </View>
                        <View style = {styles.pickerParent}>
                            <Text>Confirm Password:</Text>
                            <TextInput 
                                style = {styles.input} 
                                placeholder = "Confirm New Password"
                                secureTextEntry = {true}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => this.setState({confirmPassword: text})}
                            />
                        </View>
                        
                        <View style = {styles.pickerParent}>
                            <Button
                                    onPress={this.submitForm}
                                    title="UPDATE"
                                    disabled = {this.state.submitButtonDisable}
                            />
                        </View>
                    </View>
                    
                </View>
            </KeyboardAvoidingView>
        );
    }
}

let styles = StyleSheet.create({
  
    MainConteiner:{
        padding: 20,
    },
    HeaderView:{
        padding:8,
        
        borderBottomWidth: 3,
        elevation:3,
        
    },
    
    
    Header:{
        
        fontWeight: '500',
        fontSize:25,
    },
    input:{
       
        padding: 10,
        borderWidth: 1,
        
        
        fontWeight: '800',
        backgroundColor:'#eaf1f4',


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
    }

}); 