import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, Pressable, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import KanjiPrediction from 'model/KanjiModel';

export function CameraPicker() {
  const [model, setModel] = useState(null); // [1]
  const [image, setImage] = useState(null);
  const [cameraPermission, setCameraPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      setModel(new KanjiPrediction());
      const { status } = await Location.requestForegroundPermissionsAsync(); 
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
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

    const imageCapture = async () => {
    let result = await cameraRef.current.takePictureAsync({
        width: 224,
        height: 224,
        quality: 1,
        base64: true,
    });
    setImage(result.uri);
    await model.KanjiPredict(result)
    .then((res) => {
        console.log('line 37',res);
        alert(res);
    });
    };

    if (!cameraPermission) {
      return <View />;
    }
  
    if (!cameraPermission.granted) {
      // Camera permissions are not granted yet
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }

  return (
    <View style={styles.container}>
      {
        image && <Image source={{ uri: image }} style={styles.image} />
      }
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
