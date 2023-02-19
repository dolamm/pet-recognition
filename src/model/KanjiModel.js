import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import { Base64Binary } from 'utils';
import * as ImageManipulator from 'expo-image-manipulator';
import { storeData } from 'components/Store';
import { Alert } from 'react-native';

const modelJson = require('model/model.json');
const modelWeights = require('model/weights.bin');
const metaData = require('model/metadata.json');

export default class KanjiPrediction{
    
    constructor() {
        tf.ready().then(() => {
            console.log('Tensorflow ready.');
        })
        this.initModel().then((model) => {
            this.model = model;
        });
        this.resultPredict = null;
    }
    async initModel() {
        let model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        return model;
    }

    async convertBase64toTensor(base64) {
        const UintArray = Base64Binary.decode(base64);
        let decodedImage = decodeJpeg(UintArray, 3);
        decodedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
        return decodedImage.reshape([1, 224, 224, 3]);
    }

    async resizeImage (image) {
        const uri = image.uri;
        try {
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

    async KanjiPredict(image) {
        let imageData = await this.resizeImage(image)
        .then((res) => {
            return res;
        });
        const imageTensor = await this.convertBase64toTensor(imageData.base64);
        const normalizedImage = tf.div(imageTensor, 255.0);
        const prediction = this.model.predict(normalizedImage);
        const predictionArray = await prediction.data();
        const predictionIndex = predictionArray.indexOf(Math.max(...predictionArray));
        this.resultPredict = metaData.labels[predictionIndex];
        return this.resultPredict;
    }
    async Notification(item){
        Alert.alert(
            "Kanji Prediction Completed",
            `${item.kanji}\nhán việt:${this.resultPredict.phienam}\nonyomi:${item.onyomi}\nkunyomi:${item.kunyomi}\ný nghĩa:${item.meaning}\nmeaning:${item.eng}`,
            [
              { text: "Save Result", onPress: () => this.StoreResult(item) }
            ],
            { cancelable: true }
        );
    }
    async StoreResult(item) {
        await storeData (item).
        then((res) => {
            alert(res)
        });
    }
}
