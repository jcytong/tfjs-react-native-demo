import React, { Fragment } from 'react';
import { Button, SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

//import { Diagnostic } from './components/diagnostic';
//import { MobilenetDemo } from './components/mobilenet_demo';
//import { TestRunner } from './components/tfjs_unit_test_runner';
//import { WebcamDemo } from './components/webcam/webcam_demo';
import { RealtimeDemo } from './components/webcam/realtime_demo';

const BACKEND_TO_USE = 'rn-webgl';
export type Screen = 'main' | 'diag' | 'demo' | 'deeplab' | 'test' | 'webcam' | 'realtime';

interface AppState {
  isTfReady: boolean;
  currentScreen: Screen;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      currentScreen: 'main'
    };

    this.showRealtimeDemo= this.showRealtimeDemo.bind(this);
  }

  async componentDidMount() {
    await tf.setBackend(BACKEND_TO_USE);
    // Wait for tf to be ready.
    console.log('waiting...')
    await tf.ready();
    console.log('yeah baby...tf ready!')
    // Signal to the app that tensorflow.js can now be used.
    this.setState({
      isTfReady: true,
    });
  }

  showRealtimeDemo() {
    this.setState({ currentScreen: 'realtime' });
  }

  renderMainScreen() {
    return <Fragment>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Diagnostic</Text>
        <Button
          onPress={this.showDiagnosticScreen}
          title='Show Diagnostic Screen'
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Demo</Text>
        <Button
          onPress={this.showDemoScreen}
          title='Show Demo Screen'
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Unit tests</Text>
        <Button
          testID='unit-test-btn'
          accessibilityLabel='unit-test-btn'
          onPress={this.showTestScreen}
          title='Show Test Screen'
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Webcam Demo</Text>
        <Button
          onPress={this.showWebcamDemo}
          title='Show Webcam Demo'
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Realtime Webcam Demo</Text>
        <Button
          onPress={this.showRealtimeDemo}
          title='Show Realtime Webcam Demo'
        />
      </View>
    </Fragment>;
  }

  renderLoadingTF() {
    return <Fragment>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Loading TF</Text>
      </View>
    </Fragment>;
  }

  renderRealtimeDemo() {
    return <Fragment>
      <RealtimeDemo returnToMain={this.showMainScreen}/>
    </Fragment>;
  }

  renderContent() {
    const { currentScreen, isTfReady } = this.state;
    if (isTfReady) {
      switch (currentScreen) {
        case 'main':
          return this.renderMainScreen();
        case 'diag':
          return this.renderDiagnosticScreen();
        case 'demo':
          return this.renderDemoScreen();
        case 'test':
          return this.renderTestScreen();
        case 'webcam':
          return this.renderWebcamDemo();
        case 'realtime':
          return this.renderRealtimeDemo();
        default:
          return this.renderMainScreen();
      }
    } else {
      return this.renderLoadingTF();
    }
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView>
          <View style={styles.body}>
            {this.renderContent()}
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6,
  },
});
