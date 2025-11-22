/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, StatusBar, StyleSheet, useColorScheme, View,Text } from 'react-native';
import { 
  SafeAreaProvider ,  
} from 'react-native-safe-area-context';
import ReaderHighlighter from './ReaderHighlighter';
import { useEffect, useState } from 'react';
import {
  downloadModel,
  MODEL_ZIP_URL_CN,
} from './app/utils/download.ts';
import { loadVoskModel } from './app/utils/vosk.ts';
import { longFullText } from './testData.ts'
import DocumentPicker from 'react-native-document-picker';
import { readDocx } from './app/utils/docx';
 
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

  const [fullText, setFullText] = useState(longFullText);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    (async () => {
      try {
      } catch (e) {
        console.error(e);
      } finally {
        console.log('smile:🚀 ~ f:App m: l:47-> ');
      }

    })()
  }, []);

  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadPercent, setDownloadPercent] = useState<number>(0);
  const [isLoadModel, setIsLoadModel] = useState(false)

  async function startRecord() {
    setIsDownloading(true);
    setDownloadPercent(0);
    setIsLoadModel(false);

    let modelDir = ''
    try {
      console.log('smile:🚀 ~ f:App m:startRecord l:62->', '开始下载模型');
      // 下载模型
      const res = await downloadModel(MODEL_ZIP_URL_CN, (percent) => {
        setDownloadPercent(percent);
      });
      modelDir = res.modelDir
    } catch (e) {
      console.error(e);
      return
    } finally {
      setIsDownloading(false);
      setDownloadPercent(0);
    }

    if (!modelDir) return

    console.log('smile:🚀 ~ f:App m: l:50-> modelDir:', modelDir);
    // 加载模型
    try {
      await loadVoskModel(modelDir, (res) => {
        setRecognizedText(res);
      });
      setIsLoadModel(true)
      // 加载模型成功
    } catch (e) {
      console.error(e);
      setIsLoadModel(false)
    }
  }

  const handleImportWord = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.docx, 
        ],
      });

      if (res && res[0]) {
        const fileUri = res[0].uri;
        const text = await readDocx(fileUri);
        console.log('smile:🚀 ~ f:App m:handleImportWord l:106->', text);
        setFullText(text);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title={isDownloading ? `正在下载模型... ${((downloadPercent ?? 0) * 100).toFixed(2)}%` : '开始识别'} disabled={isDownloading} onPress={startRecord} />
        <Button title="导入 Word" onPress={handleImportWord} />
      </View>
      <Text>模型加载状态：{isLoadModel ? '成功' : '未加载'}</Text>
      <Text>语音识别结果: {recognizedText}</Text>
      <ReaderHighlighter fullText={fullText} recognizedText={recognizedText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
