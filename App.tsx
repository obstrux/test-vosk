/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReaderHighlighter from './ReaderHighlighter';
import { useEffect, useState } from 'react';
import {
  downloadModel,
  LOCAL_ZIP_PATH_CN,
  MODEL_ZIP_URL_CN,
} from './app/utils/download.ts';
import { loadVoskModel } from './app/utils/vosk.ts';
import RNFS from 'react-native-fs';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  const [fullText, setFullText] = useState('大家好，欢迎来到我们的应用。今天，我们将一起探索一些非常有趣的功能。请确保你的设备麦克风已经开启，以便我们能够进行语音交互。接下来，你只需要按照提示操作，就能轻松体验完整的功能。希望你喜欢这次的体验，也希望你在使用过程中发现更多有趣的细节。感谢你的参与，让我们开始吧');
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // const { modelDir } = await downloadModel(
        //   MODEL_ZIP_URL_CN,
        //   LOCAL_ZIP_PATH_CN,
        //   (percent) => {
        //     console.log('smile:🚀 ~ f:AppContent ~ percent:', percent);
        //   },
        // );
      } catch (e) {
        console.error(e);
      } finally {
        console.log('smile:🚀 ~ f:App m: l:47-> ');
      }

    })()
  }, []);

  async function startRecord() {
    const modelDir = LOCAL_ZIP_PATH_CN.replaceAll('.zip', '');

    console.log('smile:🚀 ~ f:App m: l:50-> modelDir:', modelDir);
    // 加载模型
    try {
      const recognizer = await loadVoskModel(modelDir, (res) => {
        setRecognizedText(res);
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <Button title={'开始识别'} onPress={startRecord}></Button>
      <ReaderHighlighter fullText={fullText} recognizedText={recognizedText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
});

export default App;
