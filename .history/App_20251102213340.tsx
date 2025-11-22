/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReaderHighlighter from './ReaderHighlighter';
import { useEffect, useState } from 'react';

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

  const [fullText, setFullText] = useState('这是一段很长的测试文本');
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    const arr = fullText.split('').reverse();
    set(() => {
      setRecognizedText(arr.pop());
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
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
