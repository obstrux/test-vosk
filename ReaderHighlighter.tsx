import React, { useRef, useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();

interface Props {
  fullText: string;
  recognizedText: string;
}

const ReaderHighlighter = (props: Props) => {
  const { fullText, recognizedText } = props;
  const scrollRef = useRef<ScrollView>(null);
  const [readIndex, setReadIndex] = useState(0);
  const [textLines, setTextLines] = useState<any[]>([]);

  console.log(recognizedText);

  useEffect(() => {
    if (!recognizedText) return;
    updateReadIndex(recognizedText.replaceAll(' ', ''));
  }, [recognizedText]);

  // 监听阅读进度和行信息变化，实现自动滚动
  useEffect(() => {
    if (textLines.length === 0) return;

    let charCount = 0;
    let targetLine = null;

    // 遍历行信息，找到包含当前 readIndex 的行
    for (const line of textLines) {
      charCount += line.text.length;
      if (charCount > readIndex) {
        targetLine = line;
        break;
      }
    }

    // 如果找到了目标行，或者已经读完（取最后一行）
    if (!targetLine && readIndex >= fullText.length) {
      targetLine = textLines[textLines.length - 1];
    }

    if (targetLine) {
      // 滚动到目标行的 y 坐标，减去 100px 的偏移量
      scrollRef.current?.scrollTo({ y: Math.max(0, targetLine.y - 100), animated: true });
    }
  }, [readIndex, textLines, fullText.length]);

  // 容错推进匹配
  const updateReadIndex = (recognized: string) => {
    if (recognized.length < 5) return;

    // 配置模糊匹配参数
    dmp.Match_Threshold = 0.4; // 阈值：0.0完全匹配，1.0非常宽松。0.4是一个比较好的平衡点
    dmp.Match_Distance = 500; // 搜索距离：表示在这个距离内搜索匹配项

    // 截取后30个字符作为匹配模式，避免 "Pattern too long" 错误
    // diff-match-patch 的 match_bitap 算法限制模式长度通常为 32
    const pattern = recognized.slice(-30);

    // 使用 match_main 进行模糊查找
    // fullText: 完整文本
    // pattern: 截取后的识别文本（后30字）
    // readIndex: 期望找到匹配项的位置（当前阅读进度）
    const matchIndex = dmp.match_main(fullText, pattern, readIndex);

    // 如果找到了匹配项 (matchIndex !== -1)
    if (matchIndex !== -1) {
      // 计算新的结束位置
      // 匹配到的位置 + 模式长度 = 当前阅读到的末尾
      const newIndex = matchIndex + pattern.length;

      // 更新进度
      // 这里我们允许进度跳转，只要它是合理的
      // 加上 Math.min 确保不越界
      const finalIndex = Math.min(newIndex, fullText.length);
      
      // 只有当进度确实改变时才更新
      if (finalIndex !== readIndex) {
        setReadIndex(finalIndex);
      }
    }
  };

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      <Text 
        style={styles.text}
        onTextLayout={(e) => setTextLines(e.nativeEvent.lines)}
      >
        <Text style={styles.read}>{fullText.slice(0, readIndex)}</Text>

        <Text style={styles.playing}>
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
