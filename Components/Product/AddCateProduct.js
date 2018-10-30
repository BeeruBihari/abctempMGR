import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    Modal,
    TextInput,
    Picker,
    ActivityIndicator
} from 'react-native';

export default class AddCateProduct extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('id',0);
        this.state = {
            visible:false,
            data1:[{'p_list_id':'1','p_name':'Soap','manu_name':'Samsung','price':'100','Menuf':'Home','pic_1':''}],
            flag:0,
            sub_id:value,
            id:'0',
            price:'',
            unit:'Kg'
        }
        console.log('Add Category Item Called..');
        this.fatchData();
    }    
    static navigationOptions = {
        headerTitle: 'Add Product',      
    };
    
    fatchData= async () => {
        try{

            let sql = "SELECT p1.p_list_id, p1.p_name, m1.manu_name, p1.pic_1 FROM  product_list_table As p1 "+
                    "INNER JOIN manufacture_list_table As m1 ON m1.manu_id = p1.manufacture_id "+
                    "WHERE p1.sub_category_id ='"+this.state.sub_id+"'";

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
                        this.setState({data1:responseJson});
                        this.setState({flag:1});
                        console.log("Fatched Data :" ,responseJson);                  
                }).catch((error) => {
                    console.error(error);
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
            })

            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data Shop : " + value1);
            
            let sql = "INSERT INTO product_table (p_list_id,shop_id,price,unit) VALUES ('"+this.state.id+"','"+value1+"','"+this.state.price+"','"+this.state.unit+"');";
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
                    alert("Added Successfully.");
                    this.fatchData();                  
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
                            <Text style={{fontSize:14,textAlign:'center',color:'green'}}>{item.manu_name}</Text>
                            <View >
                                <Button 
                                    onPress={() => {this.setState({visible:true}),this.setState({id:item.p_list_id})}}
                                    title="Add"
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

                <Modal 
                    visible={this.state.visible} 
                    style={styles.modal}
                    animationType='slide'
                    transparent={true}
                    onRequestClose={() => {
                        this.setState({visible:!this.state.visible})
                    }}                   
                >
                    <View style={styles.bgView}>
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
                            <Text style={{flex:1}}></Text>
                            <View style={{flex:1}}>
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
                        renderItem={({item}) => viewData(item)}
                        keyExtractor={item => item.id}
                        numColumns={2}
                    >
                    </FlatList>
                {/* <View style={{backgroundColor:'green',paddingLeft:20,paddingRight:20,marginBottom:10}}>
                    <Button 
                        onPress={() => this.props.navigation.navigate('AddNewItem',{id:this.state.id})}
                        title="Add Other"
                    />
                </View> */}
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
        backgroundColor:'#d9d9dd',
        height:150,
        width:'90%',
        marginTop:'35%',
        marginLeft:'5%',
        marginRight:'5%',
        borderRadius:5,
        borderColor: 'white',

    },
    modal: {
        backgroundColor: 'white',
        margin: 15, 
        alignItems: undefined,
        justifyContent: undefined,
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
