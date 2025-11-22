import React, { useRef, useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();

interface Props {
  fullText: string;
  recognizedText: string;
}

const ReaderHighlighter = (props: Props: { fullText, recognizedText }) => {

  const scrollRef = useRef<ScrollView>(null);
  const cursorRef = useRef<Text>(null);
  const [readIndex, setReadIndex] = useState(0);

  console.log(recognizedText);

  useEffect(() => {
    if (!recognizedText) return;
    updateReadIndex(recognizedText);
  }, [recognizedText]);

  // 容错推进匹配
  const updateReadIndex = (recognized: string) => {
    const diff = dmp.diff_main(fullText.slice(readIndex), recognized);
    dmp.diff_cleanupSemantic(diff);

    let matched = 0;
    diff.forEach(([type, value]) => {
      if (type === 0) matched += value.length; // 匹配字数累加
    });

    const newIndex = Math.min(readIndex + matched, fullText.length);
    if (newIndex !== readIndex) {
      setReadIndex(newIndex);
      scrollToReading();
    }
  };

  // 自动滚动到当前阅读位置
  const scrollToReading = () => {
    setTimeout(() => {
      // cursorRef.current?.measureLayout(
      //   scrollRef.current.getScrollableNode(),
      //   (x, y) => {
      //     scrollRef.current?.scrollTo({ y: y - 100, animated: true });
      //   },
      // );
    }, 50);
  };

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.read}>{fullText.slice(0, readIndex)}</Text>

        <Text ref={cursorRef} style={styles.playing}>
          {fullText[readIndex] || ''}
        </Text>

        <Text style={styles.unread}>{fullText.slice(readIndex + 1)}</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { fontSize: 18, lineHeight: 32 },
  read: { backgroundColor: '#FFD54F' },
  playing: { backgroundColor: '#FF9800', color: '#fff' },
  unread: { color: '#777' },
});

export default ReaderHighlighter;
