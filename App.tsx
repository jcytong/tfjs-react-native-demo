import React, { Fragment } from 'react';
import { Button, SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import { MobilenetDemo } from './components/mobilenet_demo';
import { TestRunner } from './components/tfjs_unit_test_runner';
import { WebcamDemo } from './components/webcam/webcam_demo';
import { RealtimeDemo } from './components/webcam/realtime_demo';
import { DeepLabDemo } from './components/deeplab_demo';

const BACKEND_TO_USE = 'rn-webgl';
export type Screen = 'main' | 'diag' | 'demo' | 'deeplab' | 'test' | 'webcam' | 'realtime';

interface AppState {
  isTfReady: boolean;
  currentScreen: Screen;
}

export default class App extends React.Component<any,AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isTfReady: false,
      currentScreen: 'main'
    };
    
    this.showDemoScreen = this.showDemoScreen.bind(this);
    this.showDeepLabScreen = this.showDeepLabScreen.bind(this);
    this.showMainScreen = this.showMainScreen.bind(this);
    this.showTestScreen = this.showTestScreen.bind(this);
    this.showWebcamDemo= this.showWebcamDemo.bind(this);
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

  showDiagnosticScreen() {
    this.setState({ currentScreen: 'diag' });
  }

  showDemoScreen() {
    this.setState({ currentScreen: 'demo' });
  }

  showDeepLabScreen() {
    this.setState({ currentScreen: 'deeplab' });
  }

  showMainScreen() {
    this.setState({ currentScreen: 'main' });
  }

  showTestScreen() {
    this.setState({ currentScreen: 'test' });
  }

  showWebcamDemo() {
    this.setState({ currentScreen: 'webcam' });
  }

  showRealtimeDemo() {
    this.setState({ currentScreen: 'realtime' });
  }

  renderDeepLabScreen() {
    const image = require('./assets/images/catsmall.jpg');
    return <Fragment>
      <DeepLabDemo
        image={image}
        returnToMain={this.showMainScreen} />
    </Fragment>;
  }

  renderDemoScreen() {
    const image = require('./assets/images/catsmall.jpg');
    return <Fragment>
      <MobilenetDemo
        image={image}
        returnToMain={this.showMainScreen} />
    </Fragment>;
  }

  renderTestScreen() {
    return <Fragment>
      <TestRunner backend={BACKEND_TO_USE} />
    </Fragment>;
  }

  renderWebcamDemo() {
    return <Fragment>
      <WebcamDemo returnToMain={this.showMainScreen}/>
    </Fragment>;
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
        <Text style={styles.sectionTitle}>DeepLab</Text>
        <Button
          onPress={this.showDeepLabScreen}
          title='Show DeepLab Screen'
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
        case 'deeplab':
          return this.renderDeepLabScreen();
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
