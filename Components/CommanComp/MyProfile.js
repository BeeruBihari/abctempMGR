import React from 'react';
import { StyleSheet, Text, View ,ScrollView,Button,Image,TextInput,KeyboardAvoidingView,ActivityIndicator,AsyncStorage} from 'react-native';

export default class MyProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           submitButtonDisable:false,
           email:"aarav@gmail.com",
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
        try {
          let email = await AsyncStorage.getItem('user_email');
          let phone = await AsyncStorage.getItem('user_phone');
          let name = await AsyncStorage.getItem('user_name');
          let state = await AsyncStorage.getItem('user_state');
          let city = await AsyncStorage.getItem('user_city');
          let landmark = await AsyncStorage.getItem('user_landmark');
          console.log("inprofile",email,phone,name,state,city,landmark);
          this.setState({
              email:email,
              phone:phone,
              name:name,
              state:state,
              city:city,
              address:landmark,
          });
         } catch (error) {
            alert("Something not working..",error);
            console.log("Something not working..",error);
        }
      }
      _storeData = async (user_email,user_phone,user_name,user_state,user_city,user_landmark) => {
        try {
          await AsyncStorage.setItem('key_login_status', 'true');
          await AsyncStorage.setItem('user_email',user_email );
          await AsyncStorage.setItem('user_phone',user_phone );
          await AsyncStorage.setItem('user_name',user_name );
          await AsyncStorage.setItem('user_state',user_state);
          await AsyncStorage.setItem('user_city',user_city );
          await AsyncStorage.setItem('user_landmark',user_landmark );

            console.log("saved");
        }catch (error) {
            console.log("Eroor in saving");
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
        let sql = "UPDATE `shop_info_table` SET`name`='"+this.state.name+"',`state`='"+this.state.state+"' ,`city`='"+this.state.city+"',`landmark`='"+this.state.address+"' WHERE user_id = (SELECT user_id FROM security_table WHERE security_table.email = '"+this.state.email+"' and security_table.phone_no = '"+this.state.phone+"') ";
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
                        
                        alert("Delivery Address updated");
                        
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
                                
                                alert("password Updated");
                                this.setState({
                                    submitButtonDisable:false
                                });   
                                this._storeData(this.state.email,this.state.phone,this.state.name,this.state.state,this.state.city,this.state.address);
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
                        <Image style={styles.image} source={require('../Image/logo.png')} />
                        <Text style={styles.H4}>Edit your profile!</Text>
                        <Text>Email:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Your Email"
                            editable = {false}
                            value = {this.state.email}
                        />
                        <Text>Phone NO:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Your phone no."
                            editable = {false}
                            value = {this.state.phone}
                        />
                        <Text>Your Name:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Your name"
                            onChangeText = {(text) => { this.setState({name:text});}}
                            value = {this.state.name}
                        />
                        <Text>State:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="State"
                            onChangeText = {(text) => { this.setState({state:text});}}
                            editable= {false}
                            value = "Bihar"
                        />
                        <Text>City:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="City"
                            onChangeText = {(text) => { this.setState({city:text});}}
                            editable = {false}
                            value = "Bhagalpur"
                        />
                        <Text>Delivery Address:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Delivery Address"
                            onChangeText = {(text) => { this.setState({address:text});}}
                            value = {this.state.address}

                        />
                        <Text>New password:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="New Password"
                            secureTextEntry = {true}
                            onChangeText = {(text) => { this.setState({password1:text});}}

                        />
                        <Text>Confirm password:</Text>
                        <TextInput 
                            underlineColorAndroid='#b3b3b3' 
                            style={styles.textInput} 
                            placeholder="Confirm Password"
                            secureTextEntry = {true}
                            onChangeText = {(text) => { this.setState({password2:text});}}


                        />
                        <Button 
                            style = {styles.button} 
                            title="Update" 
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
        backgroundColor:'#eaf1f4',
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



