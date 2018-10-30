import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import { SearchBar} from 'react-native-elements'; // 0.17.0

export default class NewItem1 extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('id',0);
        this.state = {
            id:value,
            visible:false,
            data1:[{'subcategory_id':'1','subcategory_name':'Soap','Amount':'5','subcategory_pic':'rice1.jpg'}],
            data:[],
            flag:1,
        }
        console.log('Sdd Catogery product Called');
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.fatchData();
    }    
    static navigationOptions = {
        headerTitle: 'Add Catogeries',      
    };
    
    fatchData = async () => {
        try{   
            const shop_id = await AsyncStorage.getItem('shop_id');
            console.log(shop_id)
            let sql ="SELECT DISTINCT subcategory_name,subcategory_id,subcategory_pic FROM sub_category_table where subcategory_id NOT IN ( "+
                    "SELECT DISTINCT s1.subcategory_id FROM sub_category_table As s1 "+
                    "INNER JOIN product_list_table As p1 ON p1.sub_category_id =  s1.subcategory_id "+ 
                    "INNER JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+
                    "WHERE p2.shop_id = '"+shop_id+"')"; 
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
                    this.setState({data1:responseJson});
                    this.setState({data:responseJson});
                    console.log('data fatched successfully'); 
            }).catch((error) => {
                alert("updated slow network");
                console.log(error);
            });
        }
        catch(error){
            console.log(error);
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick  = () => {

        console.log("Bcak button Clicked.");
        const {navigation} = this.props;
        navigation.state.params.onSelect();
        navigation.goBack();
        return true;
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
        viewData = (item) =>{
            return(
                <View
                    style={styles.tabIteam} 
                >
                    <View style={{flexDirection:'column'}}>
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={require('./link2.jpg')}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Text style={{fontSize:14,color:'green',textAlign:'center'}}>{item.subcategory_name}</Text>  
                            <View >
                                <Button
                                    onPress = {() => this.props.navigation.navigate('AddCate',{id:item.subcategory_id})} 
                                    title="Add"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        if(this.state.flag == 1){
            return(
                <View style={styles.bgView}> 
                <ScrollView>
                <FlatList 
                    data = {this.state.data1}
                    renderItem={({item}) => viewData(item)}
                    keyExtractor={item => item.subcategory_id}
                    numColumns={2}
                    ListHeaderComponent={HeaderFlatList()}
                >
                </FlatList>
                {/* <View style={{backgroundColor:'green',paddingLeft:20,paddingRight:20,marginBottom:10}}>
                    <Button 
                        onPress={() => this.setState({visible:true})}
                        title="Add Other"
                    />
                </View> */}
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

let styles = StyleSheet.create({
    bgView : {
        backgroundColor:'#ebeeef',
        padding:'1%',
        height:'100%',
        width:'100%'
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
        height:75,
        alignItems: 'center',
        marginLeft:'5%',
        marginTop:'5%',
        marginRight:'5%',
        width:'90%',
        borderWidth:0.3,
        borderRadius:40,
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
