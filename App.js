import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {CameraPicker} from 'components/CameraPicker.js';
import { ImageLibPicker } from 'components/ImagePicker.js'
import {View, Text} from 'react-native';
const Drawer = createDrawerNavigator();

function Welcome () {
  return (
    <View>
      <Text>Welcome</Text>
    </View>
  )
}

export default function App (){
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Welcome">
        <Drawer.Screen name="Welcome" component={Welcome} />
        <Drawer.Screen name="Camera" component={CameraPicker} />
        <Drawer.Screen name="Image Library" component={ImageLibPicker} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}