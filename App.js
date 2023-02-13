import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';

const modelJson = require('./model/model.json');
const modelWeights = require('./model/weights.bin');

const Model = async () => {
  const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  return model;
};

export default function App() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    Model().then((model) => {
      setModel(model);
    });

    tf.ready();

    (async () => {
      // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const { status } = await Location.requestForegroundPermissionsAsync(); 
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets);
    }

    console.log(result);
  };

  const predict = async () => {
    const imageAssetPath = Image.resolveAssetSource(image);
    console.log(imageAssetPath);
    const response = await fetch(imageAssetPath.uri);
    const blob = await response.blob();
    const imageTensor = await tf.browser.fromPixels(blob);
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalizedImage = tf.div(resizedImage, 255.0);
    const batchedImage = normalizedImage.expandDims(0);

    const prediction = model.predict(batchedImage);
    const predictionArray = await prediction.data();
    const predictionIndex = predictionArray.indexOf(Math.max(...predictionArray));

    console.log(predictionIndex);
    alert(predictionIndex);
  };

  return (
    <View style={styles.container}>
      <Text onPress={pickImage}>Pick an image from camera roll</Text>
      <Text onPress={predict}>Predict</Text>
      {/* <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> */}
      <StatusBar style="auto" />
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
});
