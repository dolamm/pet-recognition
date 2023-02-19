import { NavigationContainer } from '@react-navigation/native';
import {CameraPicker} from 'components/CameraPicker.js';
import { ImageLibPicker } from 'components/ImagePicker.js'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { History } from 'components/History.js';
const Tab = createMaterialBottomTabNavigator();

export default function App (){
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Camera" component={CameraPicker} options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="camera" color={color} size={26} />
          ),
        }} />
        <Tab.Screen name="Image Library" component={ImageLibPicker} options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="image" color={color} size={26} />
          ),
        }} />
        <Tab.Screen name="History" component={History} options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="history" color={color} size={26} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}