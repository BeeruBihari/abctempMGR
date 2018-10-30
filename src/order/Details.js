import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    TextInput,
    ActivityIndicator
} from 'react-native';

import { CheckBox,Rating } from 'react-native-elements';

import Connection from "../connection";

export default class RecievedDetails extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('id',0);
        let name = navigation.getParam('name',0);
        let date = navigation.getParam('date',0);
        let phone = navigation.getParam('phone',0);
        let total = navigation.getParam('total',0);
        let paid = navigation.getParam('paid',0);
        let status = navigation.getParam('status',0);

        this.state = {
            id:value,
            name:name,
            date:date,
            phone:phone,
            total:total,
            paid:paid,
            status:status,
            data1:[],
            isEmpty:'Wait List is Loading.....',
            refreshing:false,
            BtnStatus:'Packing..',
            ratingValue:'3.5',
            feedback:'No Comment'
        }
        console.log('Orderd Product List Called.');
        this.conn = new Connection();
    }    
    static navigationOptions = {
        headerTitle: 'Orderd product',      
    };
    
    componentWillMount(){
        this._cacheData();
    }
    //Fatching data from database
    _cacheData = async () =>{
        try{            
            this.setState({refreshing:true});
            console.log(" Id : ",this.state.id);
            let sql = "SELECT p2.product_table_id,p1.p_name,p2.unit,p2.price,p1.pic_1,m1.manu_name,O1.order_status,O1.quantity,O1.order_id FROM product_list_table As p1 "+
                "INNER JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+ 
                "INNER JOIN order_table As O1 ON O1.product_list_id = p2.product_table_id "+ 
                "INNER JOIN manufacture_list_table As m1 ON m1.manu_id = p1.manufacture_id "+
                "WHERE O1.cart_lot_no_id = '"+this.state.id+"'";
            //console.log(sql);
            const value = await this.conn.Query(sql);

            if(value.flag){
                this.setState({data1:value.data});
            }
            else{
                this.setState({isEmpty:value.data});
            }
            this.setState({refreshing:false});
        }
        catch(error){
            console.log(error);
        }
    }
    
    //Set Statud]s As delivered.
    approved = async(id,status) => {
        try{
            let sql = "";
            if(status == "0"){
                sql = "UPDATE order_table SET order_status = '1' WHERE order_id='"+id+"'";
            }
            else
            {
                sql = "UPDATE order_table SET order_status = '0' WHERE order_id='"+id+"'";
            }
            const value = this.conn.Query(sql);
            //console.log(value);

            this._cacheData();

        }
        catch(error){
            console.log(error);
        }
    }

    done = async() => {        
        try{    
            let sql = "";

            for(let value of this.state.data1)
            {
                if(value.order_status == "1")
                    console.log(value.order_id);
                else{
                    console.log(value.order_id);
                    sql = sql + "UPDATE order_table SET order_status = '1' WHERE order_id='"+value.order_id+"'; ";
                }
            }

            sql = sql + "UPDATE cart_lot_table SET status = '1' WHERE cart_lot_no='"+this.state.id+"'";

            const value = await this.conn.Query(sql);
            this.setState({BtnStatus:'Packed.'})
            //console.log(sql);
        }
        catch(error){
            console.log(error);
        }
    }

    render(){
        //Setting data in flat list
        viewData1 = (item) =>{
        //    console.log("status : "+ item.order_status + " result :"+ (item.order_status=='1') ? true : false);
            return(
                <View style={styles.tabIteam} >
                    <View style={{flexDirection:'row' }}>
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={require('./link2.jpg')}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Text style={{fontSize:18,color:'red',textAlign:'center'}}>{item.p_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>Unit : {item.quantity} ({item.price}/{item.unit}) </Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>{item.manu_name}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <CheckBox
                                center
                                size = {20}
                                checked={(item.order_status == '0') ? false : true}
                                onPress = {() => this.approved(item.order_id,item.order_status)}   
                            />
                        </View>
                    </View>
                </View>
            );
        }

        return(
            <View style={{backgroundColor:'#d9d9dd'}}>
                <View style={{margin:5}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Order Id: {this.state.id}</Text>
                        <Text style={{flex:1,textAlign:'right'}}>Date: {this.state.date}</Text>
                    </View>
                    <Text > Name: {this.state.name}</Text>
                    <Text > Phone No.: {this.state.phone}</Text>
                    {(this.state.status == "0") ? <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Order Status:</Text>
                        <View style={{flex:1}}>
                            <Button
                                color='green'
                                disabled = {(this.state.BtnStatus == "Packing..")? false:true}
                                title={this.state.BtnStatus}
                                onPress={() => {this.done()}}
                            >
                            </Button>
                        </View>
                    </View> :
                    <Text></Text>}
                </View>
                <ScrollView
                    height='66%'
                >
                    <FlatList 
                        data = {this.state.data1}
                        renderItem={({item}) => viewData1(item)}
                        keyExtractor={item => item.order_id}
                        ListEmptyComponent={()=>{
                            if(this.state.isEmpty =='Wait List is Loading.....')
                                 return(<View style={{justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                        <Text>{this.state.isEmpty}</Text>
                                    </View>);
                            else
                                return(<View style={{justifyContent:'center'}}>
                                            <Text>{this.state.isEmpty}</Text>
                                        </View>)}}
                    >
                    </FlatList>
                </ScrollView>
                <View style={{margin:5}}>
                    <View style={{flexDirection:'row',borderBottomColor:'black',borderBottomWidth:1}}>
                        <Text style={{flex:2}}>Total: </Text>
                        <Text style={{flex:1,borderLeftColor:'black',borderLeftWidth:1}}>{this.state.total} /-</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:2}}>Paid: </Text>
                        <TextInput 
                            style={{flex:1,borderLeftColor:'black',borderLeftWidth:1}}
                            value={this.state.paid}
                            keyboardType='numeric'
                            underlineColorAndroid='transparent'
                            onChangeText={() => {}}
                        >
                        </TextInput>
                    </View>
                    
                    <View style={{borderWidth:1,borderColor:'white',backgroundColor:'white',borderRadius:15,marginTop:2}}>
                        <Text> Feedback : {this.state.feedback} </Text>
                        {(this.state.status != "0") ? <View style={{flexDirection:'row'}}>
                            <Text style={{flex:1}}>Rating :</Text>
                            <View style={{flex:1}}>
                            <Rating
                                type="star"
                                fractions={1}
                                startingValue={this.state.ratingValue}
                                readonly
                                imageSize={30}
                                ratingBackgroundColor="#ebeeef"
                            />
                            </View>
                        </View> :
                        <Text></Text>}
                    </View>
                </View>
            </View>
        );
    }   
}


let styles = StyleSheet.create({
    bgView : {
        backgroundColor:'#ebeeef',
        height:'100%',
        width:'100%',
        padding:'1%',
    },
    tabIteam:{
        backgroundColor:'white',
        borderRadius:5,
        margin:2,
        elevation: 3,
    },
    Img : {
        flex:1,
        height:'90%',
        margin:'5%',
        width:'90%',
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
