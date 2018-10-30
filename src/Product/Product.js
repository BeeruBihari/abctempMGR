import React ,{Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator} from 'react-navigation';
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Picker,
    Button
} from 'react-native';

import PList from './PDetails';
import AddProC from './AddNewList';
import Connection from '../connection';

// Showing Product Catogory 

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

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:'temp',
            data1:[],
            data:[],
            TempData:[],
            categoryList:[],
            flag:0,
            refreshing:false,
            category:"Select Category",
            subCategory:"Select Subcategory",
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

            let sql  = "SELECT p1.p_list_id,p1.p_name,p2.unit,p2.price,p2.offer,p1.pic_1,m1.manu_name,S1.subcategory_name,C1.category_name FROM product_list_table As p1 "+
            "INNER JOIN product_table As p2 ON p1.p_list_id = p2.p_list_id "+
            "INNER JOIN sub_category_table As S1 On S1.subcategory_id = p1.sub_category_id "+
            "INNER JOIN category_table As C1 ON C1.category_id = S1.category_id "+
            "INNER JOIN manufacture_list_table As m1 ON m1.manu_id = p1.manufacture_id "+
            "WHERE p2.shop_id = '"+value1+"'";
            
            const value = await this.conn.Query(sql);
            
            if(value.flag){
                this.setState({data:value.data});
                this.setState({data1:value.data});
            }
            else{
                console.log('Something Error');
                if(value.data == "List is Empty")
                {
                    this.category();
                }
                this.setState({isEmpty:value.data});
            }
            this.setState({refreshing:false})   
        }
        catch(error){
            console.log(error);
        }
    }
    
    category = async () => {
        try{
            let sql = "SELECT category_name,subcategory_name from sub_category_table INNER JOIN category_table ON sub_category_table.category_id = category_table.category_id";
            const value = await this.conn.Query(sql);
            if(value.flag){
                this.setState({categoryList:value.data});
            }
            else{
                alert('Something Error');   
            }   
        }
        catch(error){
            console.log(error);
        }
    }
    AddNew = async () => {
        if(this.state.category != "Select Category"){
            if(this.state.subCategory != "Select Subcategory"){
                this.props.navigation.navigate('AddNPC',{
                    category:this.state.category,
                    subCategory:this.state.subCategory
                })
            }
            else{
                alert("Select Subcategory");
            }
        }
        else{
            alert("Select Category.");
        }
    }
    
    render(){
        //Setting data in flat list
        filterCategory = async(itemValue) =>{
            
            this.setState({category:itemValue});
            
            if(itemValue != "Select Category"){
                console.log("Category Method.....",itemValue);
                const CNewList  = this.state.data.filter(item => {      
                    const itemData = `${item.category_name.toUpperCase()}`;
                    const textData = itemValue.toUpperCase();
                    return itemData.indexOf(textData) > -1;    
                }); 
                console.log( "selected Data :",Object.keys(CNewList).length);
                 this.setState({data1:CNewList});
                 this.setState({TempData:CNewList});
               
            }
            else
            {
                 this.setState({data1:this.state.data});
                console.log('Data Showing.');
            }
        }
    
        ChangeUpdate = async(data) =>{
            console.log('Sub Category....... ',data);
            await this.setState({subCategory:data});
            if(data != "Select Subcategory"){
                 const CNewList1  = await this.state.TempData.filter(item => {      
                    const itemData = `${item.subcategory_name.toUpperCase()}`;
                        const textData = data.toUpperCase();
                        return itemData.indexOf(textData) > -1;    
                });
                console.log( "selected Data in Subcategory :",Object.keys(CNewList1).length);
                await this.setState({data1:CNewList1});       
            }
            else{
                await this.setState({data1:this.state.TempData});
            }        
        }

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
                            <Text style={{fontSize:14,textAlign:'center'}}>Rs.{item.price}/{item.unit}</Text>
                            <Text style={{fontSize:14,textAlign:'center',color:'green'}}>{item.manu_name}</Text>
                            <View >
                                <Button 
                                    onPress={() => this.props.navigation.navigate('PList',{
                                        data:[item],
                                        add:false,                   
                                    }) }
                                    title="Edit"
                                />
                            </View>
                        </View>
                    </View>
                </View>);
        }
        
        let categoryItem = [];
        let SubcategoryItem = [];
    
        if(this.state.isEmpty == 'Wait List is Loading.....')
        {  
            const CList = []; 
            for(let value of this.state.data){
                //console.log(value.category_name);
                CList.push(value.category_name);
            }  
            let temp = Array.from(new Set(CList));
            
            for(let value of temp){
                //console.log(value);
                categoryItem.push(<Picker.Item label={value} value={value} />);
            }
            // console.log(temp);
            // console.log('Category Sated.');
            // console.log('-----------------------------------------------');            
            
            
            const SCList = this.state.TempData.filter(item => {      
                const itemData = `${item.category_name.toUpperCase()}`;
                 const textData = this.state.category.toUpperCase();
                 return itemData.indexOf(textData) > -1;    
            });
            
            const SCF = [];
            for(let value of SCList){
                //console.log('Sub:',value.subcategory_name);
                SCF.push(value.subcategory_name);
            }

            const FinalList = Array.from(new Set(SCF));

            for(let value of FinalList){
                SubcategoryItem.push(<Picker.Item label={value} value={value} />);
            }
            // console.log(FinalList);
            // console.log('SubCategory Sated.');
            // console.log('-----------------------------------------------');
        }   
        else{
            const CList = []; 
            for(let value of this.state.categoryList){
                //console.log(value.category_name);
                CList.push(value.category_name);
            }  
            let temp = Array.from(new Set(CList));
            
            for(let value of temp){
                //console.log(value);
                categoryItem.push(<Picker.Item label={value} value={value} />);
            }
            // console.log(temp);
            // console.log('Category Sated.');
            // console.log('-----------------------------------------------');            
            
            
            const SCList = this.state.categoryList.filter(item => {      
                const itemData = `${item.category_name.toUpperCase()}`;
                 const textData = this.state.category.toUpperCase();
                 return itemData.indexOf(textData) > -1;    
            });
            
            const SCF = [];
            for(let value of SCList){
                //console.log('Sub:',value.subcategory_name);
                SCF.push(value.subcategory_name);
            }

            const FinalList = Array.from(new Set(SCF));

            for(let value of FinalList){
                SubcategoryItem.push(<Picker.Item label={value} value={value} />);
            }
            // console.log(FinalList);
            // console.log('SubCategory Sated.');
            // console.log('-----------------------------------------------');
        }   
        return(
            <View style={styles.bgView}>
                <View style={{margin:5}}>
                   <View>
                        <Picker
                            selectedValue={this.state.category}
                            onValueChange={(itemValue, itemIndex) => filterCategory(itemValue)}
                        >
                            <Picker.Item label="Select Category" value="Select Category" />
                            {categoryItem}
                        </Picker>
                   </View>
                   <View>
                        <Picker
                            selectedValue={this.state.subCategory}
                            onValueChange={(itemValue, itemIndex) => ChangeUpdate(itemValue)}
                        >
                            <Picker.Item label="Select Subcategory" value="Select Subcategory" />
                            {SubcategoryItem}               
                        </Picker>
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
                    data = {this.state.data1}
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
                <TouchableOpacity activeOpacity={0.5} onPress={this.AddNew} style={styles.TouchableOpacityStyle} >
 
                <Image source={require('../assets/Floating_Button.png')} 
                
                style={styles.FloatingButtonStyle} />
            
                </TouchableOpacity>
            </View>
        );  
    }   
}

export default RootStack = createStackNavigator(
    {
        product:{
            screen:Product,
            navigationOptions: ({ navigation }) =>({
                headerTitle:'Product ',
                headerLeft: <MenuButton obj={navigation}  />,
            }),
        },
        PList:{screen:PList},
        AddNPC:{screen:AddProC},
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
    },
    TouchableOpacityStyle:{
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
     
    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
    }

}); 
