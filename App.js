import React, { Fragment } from 'react';
import { Button, SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

//import { Diagnostic } from './components/diagnostic';
//import { MobilenetDemo } from './components/mobilenet_demo';
//import { TestRunner } from './components/tfjs_unit_test_runner';
//import { WebcamDemo } from './components/webcam/webcam_demo';
//import { RealtimeDemo } from './components/webcam/realtime_demo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
    };
  }

  async componentDidMount() {
    // Wait for tf to be ready.
    console.log('waiting...')
    await tf.ready();
    console.log('yeah baby...tf ready!')
    // Signal to the app that tensorflow.js can now be used.
    this.setState({
      isTfReady: true,
    });
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });

    return (<View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>{this.state.isTfReady}</Text>
      <Text>SO HM LO</Text>
    </View>)
  }
}
