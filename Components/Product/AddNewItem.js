import React ,{Component} from 'react';
import { Text,View,StyleSheet,ScrollView,Button ,
    TextInput,
    Picker
} from 'react-native';

export default class AddProduct extends React.Component{
    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('otherParam', 'Add New Product'),
        };
    };
    constructor(props){
        super(props);
        this.state = {
            name:'',
            manufacture:'',
            Disc:'',
            Price:'',
            pic:'',
        }
    }

    UpdateData(text){
        this.setState({
            visible: !this.state.visible
        })
        let sql = "INSERT INTO sub_category_table (category_id, subcategory_name) VALUES ('1','"+text+"');";
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
                console.log(responseJson);
                alert("Updated Successfully successfully"); 
        }).catch((error) => {
            alert("updated slow network");
            console.log(error);
        });
    }

    onClickPress(){
        if(this.state.name == ''){
            alert("select Abouve field");
        }else{
             let sql1 = 'CREATE TABLE '+this.state.name+' (';
             
             sql1 = sql1 + 'PHOTO VARCHAR (20) NOT NULL)';
            let sql = 'INSERT INTO product_name_table (table_name,description) VALUES("'+this.state.name+'" ,"this table contain Column for containing information")';
            console.log(sql1);
        }    
    }
    
    render(){
        return(
            <ScrollView style = {styles.bgView}>
                <Text style={{textAlign:'center',fontSize:20,fontWeight:'500',color:'red',marginTop:10,elevation:5}}> Enter Product Details</Text>
                 <View style={{marginTop:20}}>
                    <Text>Product Name</Text>
                    <TextInput 
                        style={styles.txtPos1}
                        placeholder='Maximum Amount'
                        onChangeText = {(text) => this.setState({Max:text})}
                        underlineColorAndroid = 'transparent'
                    />
                 </View>                 
                 <View style={{marginTop:20}}>
                    <Text>Maximum Amount</Text>
                    <TextInput 
                        style={styles.txtPos1}
                        placeholder='Maximum Amount'
                        onChangeText = {(text) => this.setState({Max:text})}
                        underlineColorAndroid = 'transparent'
                    />
                 </View>

                <View style={{marginTop:20}}>
                    <Text>Maximum Amount</Text>
                    <TextInput 
                        style={styles.txtPos1}
                        placeholder='Maximum Amount'
                        onChangeText = {(text) => this.setState({Max:text})}
                        underlineColorAndroid = 'transparent'
                    />
                 </View>

                <View style={{marginTop:20}}>
                    <Text>Maximum Amount</Text>
                    <TextInput 
                        style={styles.txtPos1}
                        placeholder='Maximum Amount'
                        onChangeText = {(text) => this.setState({Max:text})}
                        underlineColorAndroid = 'transparent'
                    />
                 </View>

                <View style={styles.PosImg}>
                    <Button
                        style={{margin:'5'}}
                        onPress={() => this.onClickPress()}
                        title = 'Submit'                    
                    />
                </View>
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    
    bgView : {
        backgroundColor:'#fdfdfd',
        height:'100%',
        width:'100%',
        padding:20
    },
    text: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'red'
    },
    PosImg : {
        marginLeft:'20%',
        marginTop:'5%',
        marginBottom:'5%',
        width:'60%'
    },
    txtPos1 : {
        height:40,
        padding:2,
        backgroundColor:'#FFFFFF',
        fontSize:20,
        fontWeight:'500',
        elevation:3,
    },
});
