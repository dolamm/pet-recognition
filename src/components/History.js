import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, Table } from "react-native";
import { getData, getAllItems, clearAll } from "./Store";
export function History() {
    const [history, setHistory] = useState('');
    
    useEffect(() => {
        getAllItems().then((res) => {
            setHistory(res);
        });
    }, []);
    console.log('line 18', history);
    const RenderItem = ( {item} ) => {
            <View style={styles.item}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <Text style={styles.itemText}>{item.kanji}</Text>
            </View>
    }

    return (
            <View style={styles.container}>
            <Text style={styles.title}>History</Text>
            {/* <FlatList
                data={history}
                renderItem={(item)=> <RenderItem item={item} />}
                keyExtractor={(item) => item.key}

            /> */}
            {
                history == null && <Text>No history</Text>
            }
            {
                history && history.map((item) => {
                    return (
                        <RenderItem item={item}/>
                    )
                })
            }
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
        marginTop: 20
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