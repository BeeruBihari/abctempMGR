import React ,{Component} from 'react';
import { Text,View,StyleSheet,ScrollView,Button ,
    TextInput,
    AsyncStorage,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

export default class Discount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Max:'0',
            Min:'0',
            disc:'0',
            btn:'Submit',
            flag:0,
            shop_id:'',
            process:true,
            refreshing:false
        }
        this._retriveData();
    }

    _retriveData = async () => {
        try{
            this.setState({refreshing:true});
            const value = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " + value);

            this.setState({shop_id:value});

            let sql = "SELECT * FROM offer_table where shop_id='"+value+"'";
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
                    console.log(Object.keys(responseJson).length);
                    //alert("changed password successfully");
                    if(Object.keys(responseJson).length > 0)
                    {
                        this.setState({btn:'Update'});
                        //console.log(responseJson[0].max_amt);
                        console.log(responseJson[0].price_grater_than);
                        console.log(responseJson[0].discount);
                        
                        this.setState({
                            Min:responseJson[0].price_grater_than
                        });
                        this.setState({
                            disc:responseJson[0].discount
                        });
                    }
                    else if(Object.keys(responseJson).length == 0)
                    {
                        this.setState({btn:'Submit'});
                    }
                    this.setState({flag:1});
                    this.setState({refreshing:false});
            }).catch((error) => {
                this.setState({refreshing:true});
                alert("updated slow network");
                console.log(error);
            });
        }
        catch(error){
            console.log(error);
        }
    }

    onClickPress(){
        
        console.log(this.state.disc);
        console.log(this.state.Max);
        console.log(this.state.Min);
        
        this.setState({process:false});
        let sql = '';

        if(this.state.btn == "Submit")
            sql = sql + "INSERT INTO offer_table (price_grater_than,shop_id,discount,status) VALUES ('"+this.state.Min+"','"+this.state.shop_id+"','"+this.state.disc+"','true');"
        else{
            if(this.state.disc > 0.5){
                sql = sql + 'UPDATE offer_table SET price_grater_than = "'+this.state.Min+'"';
                sql = sql + ',discount="'+this.state.disc+'"';
                sql = sql + ',status="true"';
            }else
            {
                sql = sql + 'UPDATE offer_table SET price_grater_than="0",discount="0",status="false"';
            }
        }

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
                alert("Updated successfully"); 
                this.setState({process:true});
        }).catch((error) => {
            alert("updated slow network");
            console.log(error);
        });

    }
    
    render(){

        if(this.state.flag == 0){
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        else{
            return(
                <ScrollView 
                    style = {styles.bgView}
                    refreshControl={<RefreshControl 
                            enabled = {true}
                            refreshing={this.state.refreshing}
                            onRefresh = {() => this._retriveData()}
                        />}
                    >
                    <View style={{margin:20}}>
                    <Text style={{textAlign:'center',fontSize:20,fontWeight:'500',color:'green',marginTop:20}}> Update Discount </Text>
                     
                     {/* <View style={{marginTop:20}}>
                        <Text>Maximum Amount</Text>
                        <TextInput 
                            style={styles.txtPos1}
                            value={this.state.Max}
                            placeholder='Maximum Amount'
                            onChangeText = {(text) => this.setState({Max:text})}
                            underlineColorAndroid = 'transparent'
                        />
                     </View> */}
    
                     <View style={{marginTop:20}}>
                        <Text>Manimum Amount</Text>
                        <TextInput 
                            style={styles.txtPos1}
                            value={this.state.Min}
                            placeholder='Minimum Amount'
                            onChangeText = {(text) => this.setState({Min:text})}
                            underlineColorAndroid = 'transparent'
                        />
                     </View>
    
                     <View style={{marginTop:20}}>
                        <Text>Discount in % (Min 1%)</Text>
                        <TextInput 
                            style={styles.txtPos1}
                            value={this.state.disc}
                            placeholder='Discount in Percentage'
                            onChangeText = {(text) => this.setState({disc:text})}
                            underlineColorAndroid = 'transparent'
                        />
                     </View>                 
                    </View>

                    <View style={styles.PosImg}>
                        { this.state.process ? <Button onPress={() => this.onClickPress()} title = {this.state.btn} /> :<ActivityIndicator size="large" color="#0000ff" />}
                    </View>
                </ScrollView>
            );
        }
    }
}

let styles = StyleSheet.create({
    
    bgView : {
        backgroundColor:'#fdfdfd',
        height:'100%',
        width:'100%'
    },
    text: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'red'
    },
    PosImg : {
        marginLeft:'20%',
        marginTop:'5%',
        marginBottom:'5%',
        width:'60%',
        padding:5
    },
    txtPos1 : {
        height:40,
        backgroundColor: '#ffffff',
        padding:2,
        fontSize:20,
        fontWeight:'500',
        elevation:3
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
});
