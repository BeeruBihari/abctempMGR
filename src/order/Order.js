import React from 'react';
import { Text,AsyncStorage,Button,View,StyleSheet,ScrollView,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1  from 'react-native-vector-icons/FontAwesome'
import DetailsScreen from './Details';
import Connection from '../connection';

class OrderScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            details:[],
            isEmpty:'Wait List is Loading.....',
            refreshing:false,
        }   
        this.conn = new Connection();
    }

    componentWillMount() {
        this._cacheData();        
    }
    //Fatching Order from database
    _cacheData = async () =>{
        try{
            this.setState({refreshing:true});
            // let shop_id = '2';
             await AsyncStorage.setItem('shop_id','2');
            let shop_id = await AsyncStorage.getItem('shop_id');
            
            console.log('Shop id:',shop_id);

            let sql = "SELECT C.cart_lot_no,C.created_at,C.status,C.total_price,C.offer_amt,C.paid_amt,C1.cname,C1.state,C1.city,C1.address,S.phone_no FROM cart_lot_table AS C "+
                    "INNER JOIN customer_info_table AS C1 ON C.customer_info_id = C1.customer_info_id "+
                    "INNER JOIN security_table AS S ON C1.user_id = S.user_id "+
                    "WHERE C.shop_info_id = '"+shop_id+"' And C.status='0' Order By C.cart_lot_no Desc" ;

            const value = await this.conn.Query(sql);

            if(value.flag){
                this.setState({details:value.data});                
            }
            else{
                alert('Something Error');
                this.setState({isEmpty:"List is empty..."})
            }
            this.setState({refreshing:false});
        }
        catch(error){
            console.log(error);
        }
    }

    render(){
        // Setting Data in Flatlist
        viewData1 = (item) =>{
            return(
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Details',{
                        id:item.cart_lot_no,
                        name:item.cname,
                        date:item.created_at,
                        phone:item.phone_no,
                        total:item.total_price,
                        paid:item.paid_amt,
                        status:item.status
                    })}
                >
                    <View 
                        style={styles.tabIteam} 
                        >
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:20,color:'green'}}>{item.cname}</Text>
                                <Text style={styles.item}>Order Id: {item.cart_lot_no}</Text>
                                <Text style={styles.item} >Total : <Icon1 name="rupee" style={{color: 'black',fontSize:15}}/>{item.total_price}</Text>
                                <Text style={{fontSize:16,color:'green'}}>Mob. {item.phone_no}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.item}>Address :{item.address}</Text>
                                <Text style={{color:'green'}}>{item.city}</Text>
                            </View>
                        </View>
                        <Text style={{textAlign:'center',color:'red'}}>{item.created_at}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return(
            <View style={styles.bgView}>
                <ScrollView 
                    refreshControl={<RefreshControl 
                        enabled = {true}
                        refreshing={this.state.refreshing}
                        onRefresh = {() => this._cacheData()}
                    /> }
                >                       
                <FlatList
                    data={this.state.details}
                    renderItem={({item}) => viewData1(item)}
                    keyExtractor={item => item.cart_lot_no}
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
                />
            </ScrollView>
            </View>
        );
    }   
}


class HistoryScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            details:[],
            isEmpty:'Wait List is Loading.....',
            refreshing:false,
        }   
        this.conn = new Connection();
    }

    componentWillMount() {
        this._cacheData1();        
    }
    //Fatching Order from database
    _cacheData1 = async () =>{
        try{
            this.setState({refreshing:true});
            let shop_id = await AsyncStorage.getItem('shop_id');
            
            console.log('Shop id:',shop_id);

            let sql = "SELECT C.cart_lot_no,C.created_at,C.status,C.total_price,C.offer_amt,C.paid_amt,C1.cname,C1.state,C1.city,C1.address,S.phone_no FROM cart_lot_table AS C "+
                    "INNER JOIN customer_info_table AS C1 ON C.customer_info_id = C1.customer_info_id "+
                    "INNER JOIN security_table AS S ON C1.user_id = S.user_id "+
                    "WHERE C.shop_info_id = '"+shop_id+"' And C.status !='0' Order By C.cart_lot_no Desc";

            const value = await this.conn.Query(sql);

            if(value.flag){
                this.setState({details:value.data});
            }
            else{
                //alert('Something Error');
                this.setState({isEmpty:"List is empty..."})
            }
            this.setState({refreshing:false});
        }
        catch(error){
            console.log(error);
        }
    }

    render(){
        // Setting Data in Flatlist
        viewData = (item) =>{
            return(
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Details',{
                        id:item.cart_lot_no,
                        name:item.cname,
                        date:item.created_at,
                        phone:item.phone_no,
                        total:item.total_price,
                        paid:item.paid_amt,
                        status:item.status
                    })}
                >
                    <View 
                        style={styles.tabIteam} 
                        >
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:35}}><Icon1 name="rupee" style={{color: 'black',fontSize: 35}}/>{item.total_price}</Text>
                                <Text>Total Amount</Text>
                                <Text >Paid:<Icon1 name="rupee" style={{color:'black',fontSize:15}}/>{item.paid_amt}</Text>
                            </View>
                            <View style={{flex:2,borderColor:'black',borderRadius:10,borderWidth:1,backgroundColor:'#d9d9db'}}>
                                    <Text style={styles.item}>Id:{item.cart_lot_no} Date:{String(item.created_at).split(' ')}</Text>
                                    <Text style={styles.item}>{item.cname}  {item.phone_no}</Text>
                                    <Text style={styles.item}> Status :{(item.status == "1") ? <Text style={{color:'green'}}>Packed</Text> : <Text style={{color:'red'}}>Deliverd</Text>} </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        return(
            <View style={styles.bgView}>
                <ScrollView 
                    refreshControl={<RefreshControl 
                        enabled = {true}
                        refreshing={this.state.refreshing}
                        onRefresh = {() => this._cacheData1()}
                    /> }
                >                       
                <FlatList
                    data={this.state.details}
                    renderItem={({item}) => viewData(item)}
                    keyExtractor={item => item.cart_lot_no}
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
                />
            </ScrollView>
            </View>
        );
    }
}

class MenuButton extends React.Component{
	render(){
		return(
			<View style={{backgroundColor:"#2874f0"}}>
				<TouchableOpacity onPress={() => { this.props.obj.toggleDrawer() } }>
					<Icon name="menu" style={{color: 'white', padding: 10, marginLeft:5, fontSize: 35}}/>
				</TouchableOpacity>
			</View>
		);
	}
}

const tab = createMaterialTopTabNavigator(
{
    Order:{screen:OrderScreen},
    History:{screen:HistoryScreen},
    },
    {
        tabBarOptions:{
            activeTintColor: 'tomato',
            inactiveTintColor: '#000000',
            style:{backgroundColor: '#c4f2e7'},
        },
        animationEnabled: false,
        swipeEnabled: true,
        initialRouteName :'Order',
    },   
);
  


export default RatingScreen = createStackNavigator(
    {
        HomeScreen: {
            screen: tab,
            navigationOptions: ({ navigation }) => ({
                headerTitle:'Rating',
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
                headerLeft: <MenuButton obj={navigation}  />,
            }),
        },
        Details : {
            screen:DetailsScreen,
        }

    },
    {
        initialRouteName:'HomeScreen'
    }
);


let styles = StyleSheet.create({
    item: {
        fontSize: 16,
    },
    msgView:{
        flex:1,
        backgroundColor:'#ebeeef',
        justifyContent:'center',
        alignItems:'center',
    },
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
        paddingLeft: 10,
        elevation: 3,
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