import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import KanjiPrediction from 'model/KanjiModel';

export function ImageLibPicker() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [presentedShape, setPresentedShape] = useState('');

  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      setModel(new KanjiPrediction());
    })();
  }, []);
  const resizeImage = async (image) => {
      try {
        const { uri, width, height } = image;
        const actions = [
            {
                resize: {
                    width: 224,
                    height: 224,
                },
            },
        ];

        const saveOptions = {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
        };

    return await ImageManipulator.manipulateAsync(uri, actions, saveOptions);
    } catch (error) {
        console.log('Could not crop & resize photo', error);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      width: 224,
      height: 224,
      quality: 1,
      base64: true,
    });
    let resizedImage = await resizeImage(result);
    console.log('line 63',resizedImage);
    setImage(resizedImage);
    await model.KanjiPredict(resizedImage)
    .then((res) => {
        console.log('line 37',res);
        alert(res);
    });
    // console.log('line 63',result.assets[0]);
    // predict(result.assets[0]);
  };


  return (
    <View style={styles.container}>
      <Text onPress={pickImage}>Pick an image from camera roll</Text>
      {
        image && <Image source={{ uri: image.uri }} style={styles.image} />
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
  camera: {
    width: 224,
    height: 224,
  },
  captureButton: {
    position: 'absolute',
    left: Dimensions.get('screen').width / 2 - 50,
    bottom: 40,
    width: 100,
    zIndex: 100,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 50,
  },
    image: {
        width: 200,
        height: 200,
    },
});
