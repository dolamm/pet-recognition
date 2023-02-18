import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { getData, getAllItems } from "../../Store";


export default function History() {
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        getAllItems().then((items) => {
        setHistory(items);
        });
    }, []);

    renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <Text style={styles.itemText}>{item.text}</Text>
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
        <Text style={styles.title}>History</Text>
        <FlatList
            data={history}
            renderItem={renderItem}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 20,
    },
    itemText: {
        fontSize: 20,
    },
});