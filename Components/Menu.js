import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions,createBottomTabNavigator } from 'react-navigation';
import  RecieveOrder  from "./RecieveOrder";
import ProductList from "./Product/ProductList";
import Discount from './Discount';
import MyProfile from './CommanComp/MyProfile';

// Calling Order Table 
class App extends React.Component {
  render() {
  return (<RecieveOrder />)
  }
}
export default tab = createBottomTabNavigator(
{
    Order:{screen:App},
    Product:{screen:ProductList},
    Discount:{screen:Discount},
    profile:{screen:MyProfile},
    
    },
    {      
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Product') {
            iconName = `cart-plus${focused ? '' : ''}`;
          } else if (routeName === 'Discount') {
            iconName = `coin${focused ? '' : ''}`;
          } else if(routeName == 'Order'){
            iconName =`call-received${focused?'':''}`;
          } else if(routeName == 'profile'){
            iconName =`account${focused?'':''}`;
          } 
          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return <Icon name={iconName} size={25} color={tintColor} />;
      },
      
      
    }),
        tabBarOptions:{
            activeTintColor: 'tomato',
            inactiveTintColor: '#000000',
            style:{backgroundColor: '#c4f2e7'},
        },
        animationEnabled: false,
        swipeEnabled: true,
        initialRouteName :'Order',
    },   
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
