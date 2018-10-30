import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    TextInput,
    ActivityIndicator
} from 'react-native';

import { CheckBox,Rating } from 'react-native-elements';

import Connection from "./connection";

export default class RecievedDetails extends React.Component{
    constructor(props){
        super(props);
    
        this.state = {
            data1:[{'id':'1','feednack':'good','rating':'1','name':'Rahul kumar'},
            {'id':'2','feednack':'good','rating':'4.2','name':'Rahul kumar'},
            {'id':'3','feednack':'good','rating':'4.3','name':'Rahul kumar'},
            {'id':'4','feednack':'good','rating':'5','name':'Rahul kumar'},
            {'id':'5','feednack':'good','rating':'2','name':'Rahul kumar'},
            {'id':'6','feednack':'good','rating':'3','name':'Rahul kumar'},
            {'id':'7','feednack':'good','rating':'4','name':'Rahul kumar'},
            {'id':'8','feednack':'good','rating':'3','name':'Rahul kumar'},
            {'id':'9','feednack':'good','rating':'3','name':'Rahul kumar'},
            {'id':'10','feednack':'good','rating':'1.2','name':'Rahul kumar'},
            {'id':'11','feednack':'good','rating':'4.2','name':'Rahul kumar'},
            {'id':'12','feednack':'good','rating':'4.3','name':'Rahul kumar'},
            {'id':'13','feednack':'good','rating':'5','name':'Rahul kumar'},
            {'id':'14','feednack':'good','rating':'2','name':'Rahul kumar'},
            {'id':'15','feednack':'good','rating':'3','name':'Rahul kumar'},
            {'id':'16','feednack':'good','rating':'4','name':'Rahul kumar'},
            {'id':'17','feednack':'good','rating':'3','name':'Rahul kumar'},
            {'id':'18','feednack':'good','rating':'3','name':'Rahul kumar'},
            {'id':'19','feednack':'good','rating':'1.2','name':'Rahul kumar'}],
            isEmpty:'Wait List is Loading.....',
            refreshing:false,
        }
        console.log('Orderd Product List Called.');
        this.conn = new Connection();
    }    
    
    componentWillMount(){
        //this._cacheData();
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
    

    render(){
        //Setting data in flat list
        viewData1 = (item) =>{
        //    console.log("status : "+ item.order_status + " result :"+ (item.order_status=='1') ? true : false);
            return(
                <View style={styles.tabIteam} >
                    <View style={{flexDirection:'row' }}>    
                        <View style={{flex:1}}>
                            <Rating
                                type="star"
                                fractions={1}
                                startingValue={item.rating}
                                readonly
                                imageSize={30}
                            />
                            <Text style={{fontSize:14,textAlign:'center'}}>{item.feednack}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{fontSize:20,textAlign:'center'}}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            );
        }

        return(
            <View style={{backgroundColor:'#d9d9dd',height:'100%'}}>
                <Text style={{fontSize:20,marginLeft:5,marginTop:5}}>All Rating</Text>
                <View style={styles.bgView}>
                    <ScrollView
                    >
                        <FlatList 
                            data = {this.state.data1}
                            renderItem={({item}) => viewData1(item)}
                            keyExtractor={item => item.id}
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
                        <Text></Text>
                    </ScrollView>
                </View>
            </View>
        );
    }   
}

let styles = StyleSheet.create({
    bgView : {
        margin:'1%',
        padding:'1%',
        borderRadius:15,
        borderWidth:1,
        borderColor:'black'
    },
    tabIteam:{
        padding:7,
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
