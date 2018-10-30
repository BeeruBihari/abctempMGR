import React from 'react';
import { StyleSheet, Text, View ,ScrollView,Button,Image,TextInput,KeyboardAvoidingView,ActivityIndicator,AsyncStorage} from 'react-native';
import Login from '../Login';

import {createDrawerNavigator,createSwitchNavigator} from 'react-navigation';

class MyProfileRegisterScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           submitButtonDisable:false,
           email:"@gmail.com",
           phone:"9102163686",
           name:"",
           address:"",
           state:"Bihar",
           city:"Bhagalpur",
           password1:"",
           password2:"",
        }
    }
    componentDidMount(){
        this._retrieveData();
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
    submitProfile = () =>{
        if(this.state.name.trim().length == 0 ||
                this.state.address.trim().length == 0 ||
                this.state.password1.trim().length == 0 ||
                this.state.password2.trim().length == 0 
        ){
            alert("All fields are mandatory!!");
            return;
        }
        if(this.state.password1 != this.state.password2){
            alert("Confirm password dont matched with previous one!!");
            return;
        }
        this.setState({
            submitButtonDisable:true
        });

        let sql = "INSERT INTO `shop_info_table`(`user_id`, `name`, `state`, `city`, `landmark`) VALUES ((SELECT user_id FROM security_table WHERE security_table.email = '"+this.state.email+"' and security_table.phone_no = '"+this.state.phone+"'),'"+this.state.name+"','"+this.state.state+"','"+this.state.city+"','"+this.state.address+"')";
        //"INSERT INTO `shop_info_table`(`user_id`) VALUES (())";
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
                    if(responseJson.length == 0){
                        this.props.navigation.navigate('MyProfileClass')
                        alert("Delivery Address Added");
                        
                    }
                    else {
                        alert("Opps!! Something looks wrong.Please Report to developer.")
                    }
                }).catch((error) => {
                    alert("Something Went wrong");
                    console.log(error);
                    this.setState({
                        submitButtonDisable:false
                    });         

                });

                sql = "UPDATE `security_table` SET `password`='"+this.state.password1+"' WHERE email = '"+this.state.email+"' and phone_no = '"+this.state.phone+"';";
                //"INSERT INTO `shop_info_table`(`user_id`) VALUES (())";
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
                                this.props.navigation.navigate('LoginClass')
                                alert("password Updated");
                                
                            }
                            else {
                                alert("Opps!! Something looks wrong.Please Report to developer.")
                            }
        
                        }).catch((error) => {
                            alert("Something Went wrong");
                            console.log(error);
                            this.setState({
                                submitButtonDisable:false
                            });         
        
                        });
        

    }
  render() {
    return (
        <ScrollView>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} enabled>
                <View style={styles.parentContainer}>
                    <View style={styles.container}>
                        <Image style={styles.image} source={require('../../Image/logo.png')} />
                        <Text style={styles.H4}>Edit your profile!</Text>
                        
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Your Email"
                            editable = {false}
                            value = {this.state.email}
                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Your phone no."
                            editable = {false}
                            value = {this.state.phone}
                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Your name"
                            onChangeText = {(text) => { this.setState({name:text});}}
                            value = {this.state.name}
                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="State"
                            onChangeText = {(text) => { this.setState({state:text});}}
                            editable= {false}
                            value = "Bihar"
                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="City"
                            onChangeText = {(text) => { this.setState({city:text});}}
                            editable = {false}
                            value = "Bhagalpur"
                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Delivery Address"
                            onChangeText = {(text) => { this.setState({address:text});}}

                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="New Password"
                            secureTextEntry = {true}
                            onChangeText = {(text) => { this.setState({password1:text});}}

                        />
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Confirm Password"
                            secureTextEntry = {true}
                            onChangeText = {(text) => { this.setState({password2:text});}}


                        />
                        <Button 
                            style = {styles.button} 
                            title="CONTINUe" 
                            onPress={()=>{ this.submitProfile()}}
                            disabled = {this.state.submitButtonDisable}
                        ></Button>
                        <ActivityIndicator 
                            style = {{ opacity : this.state.submitButtonDisable ? 1 : 0 }} 
                            size="large" 
                            color="#00ff00" />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
  }
}


class LoginClass extends React.Component{
    render(){
        return(<Login/>)
    }
}

const RootStack = createSwitchNavigator(
    {
        LoginClass:LoginClass,
        MyProfileRegisterScreen:MyProfileRegisterScreen
    },
    {
        initialRouteName: 'MyProfileRegisterScreen',
        backBehavior:'initialRoute',
       
      }
    
);

export default class MyProfileRegister extends React.Component{
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
    H1:{
        fontSize: 28,
        fontWeight: '400',
        color: "#000",
        textAlign: 'center', 
        marginBottom: 15
    },
    image:{
        justifyContent: 'flex-start',
        alignSelf: 'center',
        margin: 55,
    },
    H4:{
        fontSize: 13,
        fontWeight: '400',
        color: "#b3b3b3",
        textAlign: 'center', 
        marginBottom: 15
    },
    H5:{
        marginTop: '45%',
        fontSize: 13,
        fontWeight: '400',
        color: "#b3b3b3",
        textAlign: 'center', 
        marginBottom: 15
    },
    button:{
        marginTop: 50,
        
    }
});



