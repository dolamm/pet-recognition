import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native';

import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';

import { Base64Binary } from './utils';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
console.log('line 15',DEVICE_WIDTH, DEVICE_HEIGHT);

const modelJson = require('./model/model.json');
const modelWeights = require('./model/weights.bin');

const Model = async () => {
  const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  return model;
};

const RESULT_MAP = ['dog', 'Cat', 'Mouse'];

export default function App() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [presentedShape, setPresentedShape] = useState('');

  const cameraRef = useRef();

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
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }

    console.log('line 63',result.assets[0]);
    predict(result.assets[0]);
  };

  const imageCapture = async () => {
    let result = await cameraRef.current.takePictureAsync({
        base64: true,
      });

    console.log(result);
    // predict(result);
    const croppedImg = await cropImage(result, 0.8);
    console.log('line 71',croppedImg);
    
    predict(result);
    };

  const cropImage = async (image, mask) => {
    try {
        const { uri, width, height } = image;
        console.log('line 79', width, height);
        const cropWidth = mask * (width / DEVICE_WIDTH);
        const cropHeight = mask * (height / DEVICE_HEIGHT);
        const actions = [
            {
                crop: {
                    height: cropHeight,
                    originX: (width - cropWidth) / 2,
                    originY: (height - cropHeight) / 2,
                    width: cropWidth,
                },
            },
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

  const convertBase64toTensor = (base64) => {
    const UintArray = Base64Binary.decode(base64);
    const decodedImage = decodeJpeg(UintArray, 3);
    return decodedImage.reshape([1, 224, 224, 3]);
  }

  const predict = async (image) => {
    // const decodeImage = atob(image);
    // console.log(decodeImage);
    // const imageTensor = await tf.browser.fromPixels(decodeImage);

    // const imageAssetPath = Image.resolveAssetSource(image);
    // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    // const rawImageData = await response.arrayBuffer();

    const croppedImage = await cropImage(image, 300);
    console.log('line 131',croppedImage);
    const imageTensor = convertBase64toTensor(croppedImage.base64);

    // const Uint8Array = new Uint8Array(rawImageData);
    // const imageTensor = decodeJpeg(rawImageData);
    // const imageTensor = await tf.browser.fromPixels(Uint8Array);

    // const imageTensor = tf.tensor( new Uint8Array(rawImageData) )
    // imageTensor.reshape([1, 224, 224, 3]);
    // console.log('line 67',imageTensor);

    // const reshapedImage = tf.reshape(imageTensor, [224, 224, 3]);
    // const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    // const normalizedImage = tf.div(resizedImage, 255.0);
    // const batchedImage = normalizedImage.expandDims(0);

    const prediction = model.predict(imageTensor);
    const predictionArray = await prediction.data();
    console.log('line 149',predictionArray);
    const predictionIndex = predictionArray.indexOf(Math.max(...predictionArray));

    console.log('line 152', predictionIndex);

    setPresentedShape(RESULT_MAP[predictionIndex]);
    alert(presentedShape);
  };

  return (
    <View style={styles.container}>
      <Text onPress={pickImage}>Pick an image from camera roll</Text>

      {/* <Text onPress={predict}>Predict</Text> */}
      {/* <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> */}
      {/* <StatusBar style="auto" /> */}

      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        autoFocus={true}
        whiteBalance={Camera.Constants.WhiteBalance.auto}></Camera>
      <Pressable onPress={() => imageCapture()} style={styles.captureButton} ></Pressable>

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
    width: '100%',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    left: Dimensions.get('screen').width / 2 - 50,
    bottom: 40,
    width: 100,
    zIndex: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
  },
});
