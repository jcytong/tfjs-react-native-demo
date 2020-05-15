/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import React, { Fragment } from 'react';
import { Button, SafeAreaView, StyleSheet, ScrollView, View, StatusBar, Image, Text, ImageSourcePropType } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as deeplab from '@tensorflow-models/deeplab';
import * as jpeg from 'jpeg-js';

import { Run } from './run';

interface ScreenProps {
  returnToMain: () => void;
  image: ImageSourcePropType;
}

interface ScreenState {
  prediction: Array<{ className: string; probability: number }>;
  predictionTime?: number;
  imageChecksum?: number;
  result: ImageSourcePropType | 'NONE';
}

export class DeepLabDemo extends React.Component<
  ScreenProps,
  ScreenState
  > {
  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      prediction: [],
      result: 'NONE'
    };
  }

  async loadModel() {
    const modelName = 'pascal';   // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
    const quantizationBytes = 4;  // either 1, 2 or 4
    return await deeplab.load({base: modelName, quantizationBytes});
  }

  async componentDidMount() {
    // Load DeepLab
    const model = await this.loadModel();
    console.log('DeepLab loaded')
    console.log(2)
    //warmup DeepLab
    await model.segment(tf.zeros([1, 224, 224, 3]));

    // Read the image into a tensor
    const imageAssetPath = Image.resolveAssetSource(this.props.image);
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    const rawImageData = await response.arrayBuffer();
    const imageTensor = this.imageToTensor(rawImageData);
    console.log(imageTensor);
    // Compute a checksum for the image. Useful for debugging.
    const imageTensorSum = imageTensor.sum();
    const imageChecksum = (await imageTensorSum.data())[0];

    // Classify the image.
    const start = Date.now();
    // const prediction = await model.classify(imageTensor);
    const prediction = "123";

    console.log('Running inference...');
    const { legend, height, width, segmentationMap } = await model.segment(imageTensor);
    const result = this.props.image; // TODO: do some segmentation here
    const end = Date.now();

    this.setState({
      // prediction,
      predictionTime: end - start,
      // imageChecksum,
      result
    });
    tf.dispose([imageTensor, imageTensorSum]);
  }

  imageToTensor(rawImageData: ArrayBuffer): tf.Tensor3D {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    let tensor = tf.tensor3d(buffer, [height, width, 3]);
    // https://stackoverflow.com/questions/61318836/segment-image-with-deeplab-model-tensor-flow-react-native
    // tensor = tf.cast(tensor, 'float32');
    return tensor;
  }

  renderPrediction() {
    const { prediction, predictionTime, imageChecksum } = this.state;
    return (
      <View>
        <View style={styles.sectionContainer}>
          <Run label='Process Time' result={`${predictionTime}`} />
          <Run label='Checksum' result={`${imageChecksum}`} />
        </View>
      </View>
    );
  }

  render() {
    const { image } = this.props;
    const { prediction, result } = this.state;
    
    let resultEl;
    if (result != 'NONE') {
      resultEl = (<View><Image style={{ width: 245, height: 166 }} source={result} />
                  {this.renderPrediction()}</View>);
    } else {
      resultEl = <Text>NONE</Text>;
    }

    return (
      <Fragment>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            style={styles.scrollView}
          >
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Button onPress={this.props.returnToMain} title='Back' />
              </View>

              <View style={styles.sectionContainer}>
                {/* Title Area */}
                <View>
                  <Text style={styles.sectionTitle}>
                    DeepLab Image Segmentation in React Native
                  </Text>
                </View>
                {/* Image Area */}
                <View style={styles.imageArea}>
                  <Image style={{ width: 245, height: 166 }} source={image} />
                </View>
                {/* Result Area */}
                <View style={styles.imageArea}>
                  {resultEl}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white'
  },
  body: {
    backgroundColor: 'white',
    marginBottom: 60
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6
  },
  imageArea: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultArea: {
    marginLeft: 5,
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  resultTextHeader: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    textAlign: 'center'
  },
  prediction: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultClass: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  resultProb: {
    fontSize: 16,
    marginLeft: 5
  }
});
