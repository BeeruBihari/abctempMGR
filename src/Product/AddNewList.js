import React ,{Component} from 'react';
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Picker,
    Button
} from 'react-native';

import Connection from '../connection';

export default class Product extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('category',0);
        let flag = navigation.getParam('subCategory',0);
        this.state = {
            data:[],
            refreshing:false,
            category:value,
            subCategory:flag,
            isEmpty:'Wait List is Loading.....',
        }
        console.log('Product List Called..');
        this.conn = new Connection();   
    }   

    // Refreash the page on back press from Add Catogory..
    componentWillMount() {
        this.fire();
    }

    // Query data from table 
    fire = async () => {
        try{

            this.setState({refreshing:true});
            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " , value);

            let sql  = "SELECT p_list_id, p_name,pic_1,pic_2,pic_3,m1.manu_name FROM product_list_table As P "+
            "INNER JOIN manufacture_list_table As m1 ON m1.manu_id = P.manufacture_id "+
            "Where sub_category_id = (SELECT subcategory_id from sub_category_table where subcategory_name ='"+this.state.subCategory+"') AND p_list_id NOT IN ( "+
            "SELECT DISTINCT p1.p_list_id FROM product_list_table As p1 "+
            "LEFT JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+ 
            "WHERE p1.sub_category_id = (SELECT subcategory_id from sub_category_table where subcategory_name ='"+this.state.subCategory+"')  And p2.shop_id = '"+value1+"')";
            
            const value = await this.conn.Query(sql);
            
            if(value.flag){
                this.setState({data:value.data});
            }
            else{
                console.log('Something Error');
                if(value.data == "List is Empty")
                this.setState({isEmpty:value.data});
            }
            this.setState({refreshing:false})   
        }
        catch(error){
            console.log(error);
        }
    }
    
    
    render(){
        viewData = (item) =>{
            //console.log(item.subcategory_id);
            return(<View style={styles.tabIteam}>
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
                                    onPress={() => this.props.navigation.navigate('PList',{
                                        data:[{'subcategory_name':this.state.subCategory,
                                            'category_name':this.state.category,
                                            'price':'0',
                                            'offer':'0',
                                            'p_list_id':item.p_list_id,
                                            'pic_1':item.pic_1,
                                            'pic_2':item.pic_2,
                                            'pic_3':item.pic_3,
                                           'p_name':item.p_name,
                                            unit:'0'}],
                                        add:true,                   
                                    }) }
                                    title="Add"
                                />
                            </View>
                        </View>
                    </View>
                </View>);
        }
           
        return(
            <View style={styles.bgView}>
                <View style={{margin:5}}>
                   <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1,fontSize:16}}>Category    :</Text>
                        <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.category}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1,fontSize:16}}>SubCategory :</Text>
                        <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.SubCategory}</Text>
                    </View>
                </View>
                <ScrollView
                    refreshControl={<RefreshControl 
                        enabled = {true}
                        refreshing={this.state.refreshing}
                        onRefresh = {() => this.fire()}
                    />}
                >
                <FlatList 
                    data = {this.state.data}
                    renderItem={({item}) => viewData(item)}
                    keyExtractor={item => item.p_list_id}
                    numColumns={2}
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
}); 
