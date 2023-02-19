import {AsyncStorage} from '@react-native-async-storage/async-storage';

export const storeData = async (value) => {
    let key = Date.now().toString()
    try {
        value.key = key
        let data = JSON.stringify(data);
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
        const items = await AsyncStorage.multiGet(keys)
        // return items
        console.log(items)
        return Json.parse(items)
    } catch (error) {
        console.log(error)
    }
}