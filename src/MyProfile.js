import React from 'react';
import { StyleSheet, Text, View ,ScrollView,Button,Image,TextInput,KeyboardAvoidingView,ActivityIndicator,AsyncStorage} from 'react-native';
import { Rating } from 'react-native-elements';

export default class MyProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           submitButtonDisable_info:false,
           submitButtonDisable_pass:false,

           email:"aarav@gmail.com",
           phone:"9102163686",
           name:"",
           landmark:"",
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
          let address = await AsyncStorage.getItem('user_address');
          console.log("inprofile",email,phone,name,state,city,landmark);
          this.setState({
              email:email,
              phone:phone,
              name:name,
              state:state,
              city:city,
              landmark,landmark,
              address:address,
          });
         } catch (error) {
            alert("Something not working..",error);
            console.log("Something not working..",error);
        }
      }
      _storeData = async (user_email,user_phone,user_name,user_state,user_city,user_landmark,user_address) => {
        try {
          await AsyncStorage.setItem('key_login_status_market_r', 'true');
          await AsyncStorage.setItem('user_email',user_email );
          await AsyncStorage.setItem('user_phone',user_phone );
          await AsyncStorage.setItem('user_name',user_name );
          await AsyncStorage.setItem('user_state',user_state);
          await AsyncStorage.setItem('user_city',user_city );
          await AsyncStorage.setItem('user_landmark',user_landmark );
          await AsyncStorage.setItem('user_address',user_address );


            console.log("saved");
        }catch (error) {
            console.log("Eroor in saving");
        }
    }
    submitProfile_info = () =>{
        if(this.state.name.trim().length == 0 ||
                this.state.address.trim().length == 0 
        ){
            alert("All fields are mandatory!!");
            return;
        }
        
        this.setState({
            submitButtonDisable_info:true
        });
        let sql = "UPDATE `customer_info_table` SET`cname`='"+this.state.name+"',`state`='"+this.state.state+"' ,`city`='"+this.state.city+"',`address`='"+this.state.address+"',`landmark`='"+this.state.landmark+"' WHERE user_id = (SELECT user_id FROM security_table WHERE security_table.email = '"+this.state.email+"' and security_table.phone_no = '"+this.state.phone+"') ";
        //"INSERT INTO `customer_info_table`(`user_id`) VALUES (())";
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
                        this._storeData(this.state.email,this.state.phone,this.state.name,this.state.state,this.state.city,this.state.landmark,this.state.address);

                        this.setState({
                            submitButtonDisable_info:false
                        }); 
                    }
                    else {
                        alert("Opps!! Something looks wrong.Please Report to developer.");
                        this.setState({
                            submitButtonDisable_info:false
                        }); 
                    }
                        
                    
                    

                }).catch((error) => {
                    alert("Something Went wrong");
                    console.log(error);
                    this.setState({
                        submitButtonDisable_info:false
                    });         

                });

                

    }
    submitProfile_pass = () =>{
        if(
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
            submitButtonDisable_pass:true
        });
    
        let sql = "UPDATE `security_table` SET `password`='"+this.state.password1+"' WHERE email = '"+this.state.email+"' and phone_no = '"+this.state.phone+"';";
        //"INSERT INTO `customer_info_table`(`user_id`) VALUES (())";
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
                    if(responseJson == "NO"){
                        
                        alert("password Updated");
                        this.setState({
                            submitButtonDisable_pass:false
                        });   
                    }
                    else {
                        alert("Opps!! Something looks wrong.Please Report to developer.")
                    }       
                }).catch((error) => {
                    alert("Something Went wrong");
                    console.log(error);
                    this.setState({
                        submitButtonDisable_pass:false
                    });         

                });
    }
  render() {
    return (
        <View>
            <ScrollView
                height="90%"
            >
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} enabled>
                    <View style={styles.parentContainer}>
                        <View style={styles.container}>
                            <Text style={styles.H4}>Edit your profile!</Text>
                            <Text style={{fontSize:18}}>Email: <Text style={{fontSize:22}}>{this.state.email}</Text></Text>
                            <Text style={{fontSize:18}}>Mob.No.: <Text style={{fontSize:22}}>{this.state.phone}</Text></Text>
                            <Text>Your Name:</Text>
                            <TextInput 
                                underlineColorAndroid='transparent' 
                                style={styles.textInput} 
                                placeholder="Your name"
                                onChangeText = {(text) => { this.setState({name:text});}}
                                value = {this.state.name}
                            />
                            <Text>City:</Text>
                            <TextInput 
                                underlineColorAndroid='transparent' 
                                style={styles.textInput_disabled} 
                                placeholder="City"
                                onChangeText = {(text) => { this.setState({city:text});}}
                                editable = {false}
                                value = "Bhagalpur"
                            />
                            <Text>State:</Text>
                            <TextInput 
                                underlineColorAndroid='transparent' 
                                style={styles.textInput_disabled} 
                                placeholder="State"
                                onChangeText = {(text) => { this.setState({state:text});}}
                                editable= {false}
                                value = "Bihar"
                            />
                            <Text>Address:</Text>
                            <TextInput 
                                multiline={true}
                                numberOfLines={4}
                                underlineColorAndroid='transparent' 
                                style={styles.textInput} 
                                placeholder="Address"
                                onChangeText = {(text) => { this.setState({address:text});}}
                                value = {this.state.address}
                            />
                            <Button 
                                style = {styles.button} 
                                title="Update Info" 
                                onPress={()=>{ this.submitProfile_info()}}
                                disabled = {this.state.submitButtonDisable_info}
                            ></Button>
                            <ActivityIndicator 
                                style = {{ opacity : this.state.submitButtonDisable_info ? 1 : 0 }} 
                                size="large" 
                                color="#00ff00" />
                            <Text>New password:</Text>
                            <TextInput 
                                underlineColorAndroid='transparent' 
                                style={styles.textInput} 
                                placeholder="New Password"
                                secureTextEntry = {true}
                                onChangeText = {(text) => { this.setState({password1:text});}}

                            />
                            <Text>Confirm password:</Text>
                            <TextInput 
                                underlineColorAndroid='transparent' 
                                style={styles.textInput} 
                                placeholder="Confirm Password"
                                secureTextEntry = {true}
                                onChangeText = {(text) => { this.setState({password2:text});}}
                            />
                            <Button 
                                style = {styles.button} 
                                title="Update Password" 
                                onPress={()=>{ this.submitProfile_pass()}}
                                disabled = {this.state.submitButtonDisable_pass}
                            ></Button>
                            <ActivityIndicator 
                                style = {{ opacity : this.state.submitButtonDisable_pass ? 1 : 0 }} 
                                size="large" 
                                color="#00ff00" />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.Ratting}>
                <Text style={{flex:1,fontSize:18}}>Average:</Text>
                <View style={{flex:1}}> 
                    <Rating
                        type="star"
                        fractions={1}
                        startingValue={4.6}
                        readonly
                        imageSize={30}
                    />
                </View>
            </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
    Ratting:{
        flexDirection:'row',
        height:'8%',
        margin:'1%',
        borderColor:'black',
        backgroundColor:'white',
        borderRadius:10,
        padding:5,
        borderWidth:1
    },
    container:{
        padding:5,
        backgroundColor: '#ffffff',
    },
    textInput:{  
        textAlign: 'justify',
        marginBottom: 7,
        height: 40,
        //borderWidth: 1,
        // Set border Hex Color Code Here.
        borderColor: '#2196F3',
        
        //color:'#9c9c9c',
        // Set border Radius.
        borderRadius: 10 ,
        paddingLeft: 3,
        // Set border Radius.
        //borderRadius: 10 ,
        backgroundColor:'#eaf1f4',
    },
    textInput_disabled:{  
        textAlign: 'justify',
        marginBottom: 7,
        height: 40,
        //borderWidth: 1,
        // Set border Hex Color Code Here.
        borderColor: '#2196F3',
        
        color:'#9c9c9c',
        // Set border Radius.
        borderRadius: 10 ,
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



