import {AsyncStorage} from 'react-native';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(
            key,
            value
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
        return items
    } catch (error) {
        console.log(error)
    }
}