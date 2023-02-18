import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import { Base64Binary } from 'utils';
import * as ImageManipulator from 'expo-image-manipulator';

const modelJson = require('model/model.json');
const modelWeights = require('model/weights.bin');
const metaData = require('model/metadata.json');

const RESULT_MAP = ['dog', 'Cat', 'Mouse'];

export default class KanjiPrediction{
    
    constructor() {
        tf.ready().then(() => {
            console.log('Tensorflow ready.');
        })
        this.initModel().then((model) => {
            this.model = model;
        });
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
        console.log('line 152', predictionIndex);
        return metaData.labels[predictionIndex];
    }
}

// export const convertBase64toTensor = (base64) => {
//     const UintArray = Base64Binary.decode(base64);
//     let decodedImage = decodeJpeg(UintArray, 3);
//     decodedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
//     return decodedImage.reshape([1, 224, 224, 3]);
// }

// export const KanjiModel = async () => {
//   const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
//   return model;
// };

// export const KanjiPredict = async (model, image) => {
//     const imageTensor = convertBase64toTensor(image.base64);
//     const normalizedImage = tf.div(imageTensor, 255.0);
    
//     const prediction = model.predict(normalizedImage);
//     const predictionArray = await prediction.data();
//     const predictionIndex = predictionArray.indexOf(Math.max(...predictionArray));
//     console.log('line 152', predictionIndex);
//     return RESULT_MAP[predictionIndex];

// };