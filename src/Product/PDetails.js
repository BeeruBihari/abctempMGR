import React ,{Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator} from 'react-navigation';
import { SearchBar} from 'react-native-elements'; // 0.17.0
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    TextInput,
    RefreshControl,
    Picker,
    Button
} from 'react-native';

import Connection from '../connection';

// Showing Product Catogory 
export default class Product extends React.Component{
    constructor(props){
        super(props);

        const {navigation} = this.props;
        let value = navigation.getParam('data',0);
        let flag = navigation.getParam('add',0);
        console.log(value);
        this.state = {
            pl_id:value[0].p_list_id,
            SubCategory:value[0].subcategory_name,
            category:value[0].category_name,
            price:value[0].price,
            offer:value[0].offer,
            pic1:value[0].pic_1,
            pic2:value[0].pic_2,
            pic3:value[0].pic_3,
            name:value[0].p_name,
            add:flag,
            unit:value[0].unit,
        }
        console.log('Product List Called..');
        this.conn = new Connection();   
    }

    AddNewItem = async () => {
        try{
            const value1 = await AsyncStorage.getItem('shop_id');
            let sql = "INSERT INTO product_table (p_list_id,shop_id,price,unit,offer) VALUES ('"+this.state.pl_id+"','"+value1+"','"+this.state.price+"','"+this.state.unit+"','"+this.state.offer+"');";
            const value = await this.conn.Query(sql);                
        }
        catch(error){
            console.log(error);
        }
    }
    
    UpdateItem = async () => {
        try{
            const value1 = await AsyncStorage.getItem('shop_id');
            let sql = "UPDATE product_table SET price='"+this.state.price+"',unit='"+this.state.unit+"',offer='"+this.state.offer+"' WHERE p_list_id='"+this.state.pl_id+"' AND shop_id='"+value1+"';";
            const value = await this.conn.Query(sql);   
        }
        catch(error){
            console.log(error);
        }
    }

    removeItem = async () => {
        try{
            const value1 = await AsyncStorage.getItem('shop_id');
            let sql = "DELETE FROM product_table WHERE p_list_id='"+this.state.pl_id+"' AND shop_id='"+value1+"';";
            const value = await this.conn.Query(sql); 
        }
        catch(error){
            console.log(error);
        }
    }

    render(){    
        ViewItem = (item) =>{
            //console.log(item);
            this.setState({unit:item.unit});
            return(
            <View style={styles.container}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Category    :</Text>
                        <Text style={{flex:1}}>{item.category_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>SubCategory :</Text>
                        <Text style={{flex:1}}>{item.subcategory_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={require('../../Components/rice1.jpg')}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={{uri: `${item.pic_1}`}}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={{uri: `${item.pic_1}`}}
                            />
                        </View>    
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Name :</Text>
                        <Text style={{flex:1}}>{item.p_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Unit :</Text>
                        <View style={{flex:1}}>
                            <Picker
                                selectedValue={this.state.unit}
                                onValueChange={(itemValue, itemIndex) => this.setState({unit:itemValue})}
                            >
                                <Picker.Item label="Kg" value="Kg" />
                                <Picker.Item label="Litre" value="Litre" />
                                <Picker.Item label="Packet(5kg)" value="Packet(5kg)" />
                                <Picker.Item label="Packet(10kg)" value="Packet(10kg)" />
                                <Picker.Item label="g" value="g" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Price :</Text>
                        <Text style={{flex:1}}>{item.price}</Text>
                    </View>
                    <View >
                        <Button 
                            onPress={() => {}}
                            title="Add"
                        />
                    </View>
                </View>
            );
        }
        return(
            <View style={styles.bgView}>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Category    :</Text>
                <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.category}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>SubCategory :</Text>
                <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.SubCategory}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Image
                        style={styles.Img}
                        source={require('../../Components/rice1.jpg')}
                />    
                <Image
                        style={styles.Img}
                        source={{uri: `data:image/jpeg;base64,${this.state.pic1}`}}
                />    
                <Image
                        style={styles.Img}
                        source={{uri: `data:image/jpeg;base64,${this.state.pic1}`}}
                />    
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Name :</Text>
                <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.name}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Offer :</Text>
                <TextInput
                    style={{flex:1}} 
                    underlineColorAndroid='transparent'  
                    placeholder={"Enter Offer"}
                    onChangeText = {(text) => { this.setState({offer:text});}}
                    value = {this.state.offer}
                />
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Unit :</Text>
                <View style={{flex:1}}>
                    <Picker
                        selectedValue={this.state.unit}
                        onValueChange={(itemValue, itemIndex) => this.setState({unit:itemValue})}
                    >
                        <Picker.Item label="Kg" value="Kg" />
                        <Picker.Item label="Litre" value="Litre" />
                        <Picker.Item label="Packet(5kg)" value="Packet(5kg)" />
                        <Picker.Item label="Packet(10kg)" value="Packet(10kg)" />
                        <Picker.Item label="g" value="g" />
                    </Picker>
                </View>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Price :</Text>
                <TextInput
                    style={{flex:1}} 
                    underlineColorAndroid='transparent'  
                    placeholder={"Enter Price"}
                    onChangeText = {(text) => { this.setState({price:text});}}
                    value = {this.state.price}
                />
            </View>
            <View >
                {this.state.add ? 
                    <Button 
                        onPress={() => {this.AddNewItem()}}
                        title="Add"
                    />
                    :
                    <View style={{flexDirection:'row',margin:10}}>
                        <View style={{flex:1,margin:2}}>
                            <Button
                                color="green" 
                                onPress={() => {this.UpdateItem()}}
                                title="Update"
                            />      
                        </View>
                        <View style={{flex:1,margin:2}}>
                            <Button
                                color="red" 
                                onPress={() => {this.removeItem()}}
                                title="Remove"
                            />      
                        </View>
                    </View>
                    }
            </View>
        </View>
        );  
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
        padding:'2%',
    },
    Img : {
        flex:1,
        height:100,
        alignItems: 'center',
        marginLeft:'5%',
        marginTop:'5%',
        marginRight:'5%',
        width:'90%',
        borderRadius:15,
        borderWidth:0.3,
    },
    container: {
        flex: 1,
        height:'100%',
        justifyContent: 'center'
    },
}); 
