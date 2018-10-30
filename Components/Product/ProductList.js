import React ,{Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator} from 'react-navigation';
import { SearchBar} from 'react-native-elements'; // 0.17.0
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

import AddItemList from './AddNewItem';
import itemList from './AddNewItemList'
import PList from './PDetails';
import AddProC from './AddNewProductList';
import AddCateProduct from './AddCateProduct';

// Showing Product Catogory 
class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:'temp',
            data1:[],
            data:[],
            flag:0,
            refreshing:false,
            ndf:false,
            err:false,
        }
        console.log('Product List Called..');
        this.fire();
    }   
    
    // Calling Add Catogory tab to add New Existing Catogory..
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: 'Product Catogeries',
            headerRight: (
                <TouchableOpacity
                    style={{marginRight:20}}
                    onPress={() =>  navigation.navigate('AddNPC',{onSelect: () => params.onSelect()})}
                >
                    <Icon name='plus' size={35} color='red' />
                </TouchableOpacity>
              ),   
        };
    };

    // Refreash the page on back press from Add Catogory..
    componentDidMount() {
        const { navigation } = this.props;
        navigation.setParams({
          onSelect: this.onSelect,
        });
    }
      
    // Refresh Page      
    onSelect = () => {
        console.log("Returned Successfully...");
        this.fire();
    }

    // Query data from table 
    fire = async () => {
        try{
            this.setState({refreshing:true});
            const value = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " , value);
            let sql = "SELECT DISTINCT s1.subcategory_name,s1.subcategory_id,s1.subcategory_pic FROM sub_category_table As s1 "+
            "INNER JOIN product_list_table As p1 ON p1.sub_category_id =  s1.subcategory_id "+
            "INNER JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+
            "WHERE p2.shop_id = '"+ value +"'";
            
            this.setState({ndf:false});
            this.setState({err:false});
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
                    //console.log(responseJson);
                    if(Object.keys(responseJson).length == 0)
                       {
                        alert('No Record Found!');
                        this.setState({ndf:true});
                        
                       } 
                    else{
                        this.setState({data1:responseJson});
                        this.setState({data:responseJson});
                    }
                    this.setState({flag:1}); 
                    this.setState({refreshing:false});
                    console.log('data fatached successfully..');
            }).catch((error) => {
                this.setState({refreshing:true});
                this.setState({err:true});
                this.setState({flag:1});
                alert("updated slow network");
                console.log(error);
               
            });
        }
        catch(error){
            console.log(error);
        }
    }
    
    render(){
        searchFilterFunction = (text) =>{
            console.log(text);
            const newData = this.state.data.filter(item => {      
              const itemData = `${item.subcategory_name.toUpperCase()}`;
               const textData = text.toUpperCase();
               return itemData.indexOf(textData) > -1;    
            });    
            this.setState({ data1: newData });
          }
      
          HeaderFlatList = () =>{
              return(
                <SearchBar        
                  placeholder="Type Here..."        
                  lightTheme        
                  round        
                  onChangeText={ (text) => searchFilterFunction(text)}
                  autoCorrect={false}             
                />  
              );
      
          }
        //Setting data in flat list
        viewData = (item) =>{
            console.log(item.subcategory_id);
            return( <View style={styles.tabIteam}>
                        <TouchableOpacity 
                            onPress = {() => this.props.navigation.navigate('PList',{id:item.subcategory_id,onSelect:this.onSelect})}
                        >
                            <View style={{flexDirection:'column'}}>
                                <View style={{flex:1}}>
                                    <Image
                                        style={styles.Img}
                                         source={{uri: `data:image/jpeg;base64,${item.subcategory_pic}`}}
                                    />
                                </View>    
                                <View style={{flex:1}}>
                                    <Text style={{fontSize:20,color:'green',textAlign:'center'}}>{item.subcategory_name}</Text>
                                    {/* <Text style={styles.item}>Sub Catogeries : {item.Amount}</Text>   */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>);
        }

        if(this.state.flag == 0){
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        else{
            return(
                <View style={styles.bgView}> 
                    <ScrollView
                        refreshControl={<RefreshControl 
                            enabled = {true}
                            refreshing={this.state.refreshing}
                            onRefresh = {() => this.fire()}
                        />}
                    >
                    { this.state.ndf ?
                            <View>
                                <Text style={{textAlign:'center'}}>No Data Found.</Text>
                            </View>
                        :
                        this.state.err ?
                                <View>
                                    <Text style={{textAlign:'center'}}> Network Slow Detected , Scroll to refresh the page.</Text>
                                </View>
                        :
                        <FlatList 
                            data = {this.state.data1}
                            renderItem={({item}) => viewData(item)}
                            keyExtractor={item => item.subcategory_id}
                            numColumns={2}
                            ListHeaderComponent= {HeaderFlatList()}
                        >
                        </FlatList>

                    }
                        
                    </ScrollView>
                </View>
            );
        }
    }   
}

const RootStack = createStackNavigator(
    {
        product:{screen:Product},
        AddNewItem:{screen:AddItemList},
        PList:{screen:PList},
        ItemList:{screen:itemList},
        AddNPC:{screen:AddProC},
        AddCate:{screen:AddCateProduct}
    },
    {

        initialRouteName: 'product',
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

export default class ProductList extends React.Component {
    render() {
        return <RootStack />;
    }
}

let styles = StyleSheet.create({
    item: {
        textAlign:'center',
        fontSize: 14,
    },
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
        borderRadius:50,
        borderWidth:0.3,
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
