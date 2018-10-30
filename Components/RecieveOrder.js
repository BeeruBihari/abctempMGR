import React ,{Component} from 'react';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { Text,AsyncStorage,Button,View,StyleSheet,ScrollView,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    BackHandler,
    BackAndroid,
} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import RecieveDetils from "./RecieveDetils";

class Recieved extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            details:[],
            flag:0,
            refreshing:false,
            ndf:false,
            err:false
        }   
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);   
        console.log('Recieve Order Called..');  
        this._cacheData();
    }

    // Calling Add Catogory tab to add New Existing Catogory..
    static navigationOptions = () => {
        return {
            headerTitle: 'Recieved Order',
        };
    };
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick  = () => {
        console.log("Bcak button Clicked.");
        BackAndroid.exitApp();
    }

    //Fatching Order from database
    _cacheData = async () =>{
        try{
            this.setState({refreshing:true});
            // let shop_id = '2';
            // await AsyncStorage.setItem('shop_id','2');
            this.setState({ndf:false});
            this.setState({err:false});
            let shop_id = await AsyncStorage.getItem('shop_id');
            
            console.log('Shop id:',shop_id);

            let sql = "SELECT C.cart_lot_no,C.status,C.total_price,C.offer_amt,C.paid_amt,C1.cname,C1.state,C1.city,C1.address,S.phone_no FROM cart_lot_table AS C "+
                    "INNER JOIN customer_info_table AS C1 ON C.customer_info_id = C1.customer_info_id "+
                    "INNER JOIN security_table AS S ON C1.user_id = S.user_id "+
                    "WHERE C.shop_info_id = '"+shop_id+"' And C.status='0'";

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
                    if(Object.keys(responseJson).length == 0){
                        alert('No Record Found!');
                        this.setState({ndf:true})
                    }
                    else{
                        this.setState({details:responseJson});
                        console.log('Data Fatched Successfully..');
                    } 
                    this.setState({refreshing:false});
                    this.setState({flag:1});
            }).catch((error) => {
                alert("updated slow network");
                console.log(error);
                this.setState({flag:1});
                this.setState({err:true});
                this.setState({refreshing:true})
            });
        }
        catch(error){
            console.log(error);
        }
    }

    render(){
        // Setting Data in Flatlist
        viewData = (item) =>{
            console.log((item.status == "0"));
            return(
                <View 
                    style={styles.tabIteam} 
                    >
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{fontSize:20,color:'green'}}>{item.cname}</Text>
                            <Text style={styles.item}>Paid Amount: {item.paid_amt}</Text>
                            <Text style={styles.item}>Offer Amount: {item.offer_amt}</Text>
                            <Text style={styles.item}>Total Rs.: {item.total_price}</Text>
                            <Text style={{fontSize:16,color:'green'}}>Mob. {item.phone_no}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.item}>Address :{item.address}</Text>
                            <Text style={{color:'green'}}>{item.city}</Text>
                        </View>
                    </View>
                    { (item.status == "1") ? <Text style={{fontSize:20,color:'red'}}>Delivered</Text>:<Text style={{fontSize:20,color:'green'}}>Active</Text>}
                    <View
                        style={{marginBottom:10,marginRight:'30%',marginLeft:'30%',marginTop:10,position:'relative'}}
                    >
                        <Button
                            title="Details"
                            onPress={() => this.props.navigation.navigate('Details',{id:item.cart_lot_no})}
                        />
                    </View>
                </View>
            );
        }

        if (this.state.flag == 1) {
            return(
                <View style={styles.bgView}>
                    <ScrollView 
                        refreshControl={<RefreshControl 
                            enabled = {true}
                            refreshing={this.state.refreshing}
                            onRefresh = {() => this._cacheData()}
                        /> }
                    >                 
                    {this.state.ndf ? 
                        this.state.err ?
                            <View>
                                <Text style={{fontSize:20,textAlign:'center'}}>     No Record Found !     </Text>
                                <Text>Scroll To Refresh</Text>
                            </View>
                        :
                            <View>
                                <Text style={{fontSize:20,textAlign:'center'}}>      No Record Found !      </Text>
                            </View>
                    :      
                        <FlatList
                            data={this.state.details}
                            renderItem={({item}) => viewData(item)}
                            keyExtractor={item => item.cart_lot_no}
                        />
                    }
                </ScrollView>
                </View>
            );   
        }
        else{
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
    }   
}

export default Home = createStackNavigator(
{
        home:{screen:Recieved},
        Details:{screen:RecieveDetils}
    },
    {
    initialRouteName:'home',
    navigationOptions: {
        headerStyle: {
        backgroundColor: '#003f17',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
    },  
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
        paddingTop: 10,
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