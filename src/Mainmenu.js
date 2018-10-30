import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity } from 'react-native';
import {createDrawerNavigator,DrawerItems, SafeAreaView ,createStackNavigator} from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import Order from './order/Order';
import Profile from './MyProfile';
import Rating from './RatingScreen'
import Product from './Product/Product';
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

class App2 extends React.Component{
    render(){
        return(<View></View>);
    }
}

const RatingScreen = createStackNavigator(
{
      HomeScreen: {
        screen: Rating,
      }
    },
    {
      navigationOptions: ({ navigation }) => ({
              headerTitle:'Rating',
              headerStyle: {
                  backgroundColor: '#2874f0'
              },
              headerLeft: <MenuButton obj={navigation}  />,
      }),
    }
);

const MyProfle = createStackNavigator(
    {
      HomeScreen: {
        screen: Profile,
      }
    },
    {
      navigationOptions: ({ navigation }) => ({
            headerTitle:'My Profile',
            headerStyle: {
                backgroundColor: '#2874f0'
            },
            headerLeft: <MenuButton obj={navigation}  />,
      }),
    }
);


export default AppDrawerNavigator = createDrawerNavigator({
  Order:{
		screen:Order,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="call-received" size={24} style={{ color: tintColor }} />),
	    }
    },
    
	Product: {
		screen: Product,
		navigationOptions: {
				drawerIcon: ({ tintColor }) => (<Icon name="cart-plus" size={24} style={{ color: tintColor }} />),
		}
	},
	Profle: {
        screen: MyProfle,
		navigationOptions: {
				drawerIcon: ({ tintColor }) => (<Icon name="account" size={24} style={{ color: tintColor }} />),
		}
	},
	Rating: {
		screen: RatingScreen,
		navigationOptions: {
				drawerIcon: ({ tintColor }) => (<Icon name="star" size={24} style={{ color: tintColor }} />),
		}
	},
},{
    initialRouteName:'Order',
	//contentComponent:CustomDrawerContentComponent,
})
