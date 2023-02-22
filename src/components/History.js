import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, Table, Button, ScrollView } from "react-native";
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
        return (
            <View style={styles.item}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <Text style={styles.itemText}>{item.kanji}</Text>
                <Text style={styles.itemText}>{item.meaning}</Text>
            </View>
        )
    }
    const clearHistory = () => {
        clearAll();
        setHistory(null);
    }
    return (
            <View style={styles.container}>
            <Text style={styles.title}>History</Text>
            <Button title="Clear History" onPress={() => clearHistory()} />
            {/* <FlatList
                data={history}
                renderItem={(item)=> <RenderItem item={item} />}
                keyExtractor={(item) => item.key}

            /> */}
            <ScrollView>
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20
    },
    item: {
        // flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: 200
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 20,
        alignItems: 'center',
    },
    itemText: {
        fontSize: 20,
    },
    scrollView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});