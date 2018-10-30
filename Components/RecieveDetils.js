import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';

export default class RecievedDetails extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('id',0);
        this.state = {
            id:value,
            data1:[],
            flag:0,
        }
        console.log('Orderd Product List Called.');
        this._cacheData();
    }    
    static navigationOptions = {
        headerTitle: 'Orderd product',      
    };
    
    //Fatching data from database
    _cacheData = async () =>{
        
        try{            
            console.log(" Id : ",this.state.id);
            let sql = "SELECT p2.product_table_id,p1.p_name,p2.unit,p2.price,p1.pic_1,m1.manu_name,O1.order_status,O1.quantity,O1.order_id FROM product_list_table As p1 "+
                "INNER JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+ 
                "INNER JOIN order_table As O1 ON O1.product_list_id = p2.product_table_id "+ 
                "INNER JOIN manufacture_list_table As m1 ON m1.manu_id = p1.manufacture_id "+
                "WHERE O1.cart_lot_no_id = '"+this.state.id+"'";
            //console.log(sql);
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
                    //alert('jj');
                    console.log(responseJson);
                    if(Object.keys(responseJson).length == 0)
                        alert('No Record Found!');
                    else{
                        this.setState({data1:responseJson});
                        console.log('Data fatched successfully..');
                    }    
                    this.setState({flag:1}); 
            }).catch((error) => {
                this.setState({flag:2})
                alert("updated slow network");
                console.log(error);
            });
        }
        catch(error){
            console.log(error);
        }
    }
    
    //Set Statud]s As delivered.
    approved(id){
        let sql = "UPDATE order_table SET order_status = '1' WHERE order_id='"+id+"'";
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
                alert('Done');
                this._cacheData();
        }).catch((error) => {
            alert("updated slow network");
            console.log(error);
        });
    }

    render(){

        //Setting data in flat list
        viewData1 = (item) =>{
        //    console.log("status : "+ item.order_status + " result :"+ (item.order_status=='1') ? true : false);
            return(
                <View style={styles.tabIteam} >
                    <View style={{flexDirection:'column' }}>
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={require('./link2.jpg')}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Text style={{fontSize:18,color:'red',textAlign:'center'}}>{item.p_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>Rs.{item.price}/{item.unit}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>{item.manu_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>Quantity: {item.quantity}</Text>
                            <View >
                                <Button 
                                    disabled={(item.order_status == '0') ? false : true}
                                    onPress={() => this.approved(item.order_id)}
                                    title={(item.order_status == '0') ? "Approve" : "Approved"}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        if(this.state.flag ==1){
            return(
                <View style={{backgroundColor:'#d9d9dd'}}> 
                    <ScrollView>
                    <FlatList 
                        data = {this.state.data1}
                        renderItem={({item}) => viewData1(item)}
                        keyExtractor={item => item.order_id}
                        numColumns={2}
                    >
                    </FlatList>
                </ScrollView>
                </View>
            );
        }
        else
        {
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        
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
        borderRadius:3,
        width:'49%',
        margin:0.5,
        padding:5,
        elevation: 3,
    },
    Img : {
        flex:1,
        height:100,
        alignItems: 'center',
        marginLeft:'5%',
        marginTop:'5%',
        marginRight:'5%',
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
