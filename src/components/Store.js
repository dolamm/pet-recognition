import {AsyncStorage} from 'react-native';

export const storeData = async (value) => {
    let key = new Date().getTime().toString();
    try {
        value.key = key;
        let data = JSON.stringify(value);
        await AsyncStorage.setItem(
            key,
            data
        )
    } catch (error) {
        console.log(error)
    }
    return "Save success!"
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
        let keys = await AsyncStorage.getAllKeys()
        console.log(keys)
        const data = await AsyncStorage.multiGet(keys)
        let all = [];
        data.map((result, i, data) => {
            let value = JSON.parse(data[i][1]);
            all.push(value);
        })
        return all;
    } catch (error) {
        console.log(error)
    }
}

export const clearAll = async () => {
    try {
        await AsyncStorage.clear()
    } catch (error) {
        console.log(error)
    }
}