import React ,{Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    Picker,
    Modal,
    TextInput,
    BackHandler,
    ActivityIndicator
} from 'react-native';


export default class Product extends React.Component{
   
    constructor(props){
        super(props); 
        
        const {navigation} = this.props;
        let value = navigation.getParam('id',0);
        
        this.state = {
            visible:false,
            flag:0,
            id :value,
            pl_id:'0',
            price:'',
            unit:'Kg',
            data1:[{'p_list_id':'1','p_name':'Soap','quantity':'Small','price':'100','Menuf':'Home','pic_1':''}],
        }
        console.log(value);
        this.fire();
    
    } 

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            headerTitle: 'Product List',
            headerRight: (
                <TouchableOpacity
                    style={{marginRight:20}}
                    onPress={() => navigation.navigate('ItemList',{onSelect: () => params.onSelect()})}
                >
                    <Icon name='plus' size={35} color='black' />
                </TouchableOpacity>
              ),   
        };
    };

    componentDidMount() {
        const { navigation } = this.props;
      
        navigation.setParams({
          onSelect: this.onSelect,
        });
    }

    onSelect = () => {
        console.log("Returned Successfully...");
        this.fire();
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

    fire = async () => {   
        console.log("method called."); 

        try{

            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " + value1);

            await AsyncStorage.setItem('sub_id',this.state.id);
            
            let sql = "SELECT p1.p_list_id,p1.p_name,p2.unit,p2.price,p1.pic_1,m1.manu_name FROM product_list_table As p1 "+
                "INNER JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+ 
                "INNER JOIN manufacture_list_table As m1 ON m1.manu_id = p1.manufacture_id "+
                "WHERE p1.sub_category_id = '"+this.state.id+"' AND p2.shop_id = '"+value1+"'";
            
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
                    //alert('jj');
                    console.log(responseJson);
                    if(Object.keys(responseJson).length == 0)
                        alert('No Record Found!');
                    else
                        this.setState({data1:responseJson});
                    this.setState({flag:1}); 
            }).catch((error) => {
                alert("updated slow network");
                console.log(error);
            });
        }
        catch(error){
            console.log(error);
        }
    }

    UpdateData = async (text) => {
        try{
            this.setState({
                visible: !this.state.visible
            });

            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data Shop : " + value1);
            
            let sql = '';
            if(text == 'Delete'){
                sql = "DELETE FROM product_table WHERE p_list_id='"+this.state.pl_id+"' AND shop_id='"+value1+"';";
            }
            else
                sql = "UPDATE product_table SET price='"+this.state.price+"',unit='"+this.state.unit+"' WHERE p_list_id='"+this.state.pl_id+"' AND shop_id='"+value1+"';";
            
            console.log("Mathos Called.",this.state.price);
            console.log(sql);
            fetch('http://biharilegends.com/biharilegends.com/market_go/run_query.php', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query:sql,
            }) 
            }).then((response) => response.json())
                .then((responseJson) => {
                    alert("Updated Successfully.");
                    this.fire();                  
                }).catch((error) => {
                    console.error(error);
            });
        }
        catch(error){
            console.log(error);
        }        
    }

    render(){
        viewData = (item) =>{
            return(
                <View style={styles.tabIteam} >
                    <View style={{flexDirection:'column' }}>
                        <View style={{flex:1}}>
                        <Image
                            style={styles.Img}
                            source={{uri: `data:image/jpeg;base64,${item.pic_1}`}}
                        />
                        </View>    
                        <View style={{flex:1}}>
                            <Text style={{fontSize:18,color:'red',textAlign:'center'}}>{item.p_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>Rs.{item.price}/{item.unit}</Text>
                            <Text style={{fontSize:14,textAlign:'center',color:'green'}}>{item.manu_name}</Text>
                            <View >
                                <Button 
                                    onPress={() => {this.setState({visible:true}),this.setState({pl_id:item.p_list_id})}}
                                    title=" Update "
                                />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        if(this.state.flag == 0){
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }else{
            return(
                <View style={styles.bgView}>
                    <Modal 
                        visible={this.state.visible} 
                        animationType='slide'
                        transparent={true}
                        onRequestClose={() => {
                            this.setState({visible:!this.state.visible})
                        }}                   
                    >
                        <View style={styles.bgView1}>
                            <View style={{flexDirection:'row',padding:15}}>
                                <View style={{flex:2}}>
                                    <TextInput
                                        style={{fontSize:20,color:'black',borderColor:'black',borderWidth:1}}
                                        placeholder='Enter Price'
                                        keyboardType='numeric'
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.setState({price:text})}
                                    />
                                </View>
                                <Text> </Text>
                                <View style={{flex:2}}>
                                    <Picker
                                        selectedValue={this.state.unit}
                                        onValueChange={(itemValue, itemIndex) => this.setState({unit:itemValue})}
                                    >
                                        <Picker.Item label="Kg" value="Kg" />
                                        <Picker.Item label="Packet" value="Packet" />
                                        <Picker.Item label="ML" value="ML" />
                                        <Picker.Item label="Litre" value="Litre" />
                                        <Picker.Item label="Dibba" value="Dibba" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',padding:15}}>
                                <View style={{flex:1}}>
                                    <Button
                                        title='Cancel'
                                        onPress={() => this.setState({visible:!this.state.visible})}
                                    >
                                    </Button>
                                </View>
                                <View style={{flex:1,marginLeft:5}}>
                                    <Button 
                                        title='Remove'
                                        onPress={() => this.UpdateData('Delete')}
                                    >
                                    </Button>
                                </View>
                                <View style={{flex:1,marginLeft:5}}>
                                    <Button 
                                        title='Submit'
                                        onPress={() => this.UpdateData()}
                                    >
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    
                    <ScrollView> 
                        <FlatList 
                            data = {this.state.data1}
                            renderItem={({item}) =>viewData(item)}
                            keyExtractor={item => item.p_list_id}
                            numColumns={2}
                        >
                        </FlatList>
                    </ScrollView>
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
    bgView1 : {
        backgroundColor:'#d9d9dd',
        height:150,
        width:'90%',
        marginTop:'35%',
        marginLeft:'5%',
        marginRight:'5%',
        borderRadius:5,
        borderColor: 'white',

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
