import {AsyncStorage} from 'react-native';

export const storeData = async (value) => {
    let key = Date.now().toString()
    try {
        value.key = key
        let data = JSON.stringify(value);
        console.log("Store.js"+ data)
        await AsyncStorage.setItem(
            key,
            data
        )
    } catch (error) {
        console.log(error)
    }
}

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
    } catch (error) {
        console.log(error)
    }
}

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log(error)
    }
}

export const getAllItems = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys()
        console.log('line 40',keys)
        const items = await AsyncStorage.multiGet(keys)
        console.log('line 43',items)

        for (let i = 0; i < items.length; i++) {
            items[i][1] = JSON.parse(items[i][1])
            console.log('line 47',items[i][1])
        }
        
        return JSON.parse(items)
    } catch (error) {
        console.log(error)
    }
}