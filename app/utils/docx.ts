import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

export async function readDocx(fileUri: string): Promise<string> {
  try {
    // 1. 准备临时目录
    const tempDir = `${RNFS.CachesDirectoryPath}/docx_temp_${Date.now()}`;
    await RNFS.mkdir(tempDir);

    // 2. 解压 docx 文件 (docx 本质上是 zip)
    // 注意：iOS 上 fileUri 可能以 file:// 开头，Android 上可能是 content:// 或 file://
    // react-native-zip-archive 通常需要标准路径
    let sourcePath = fileUri;
    if (sourcePath.startsWith('file://')) {
        sourcePath = sourcePath.replace('file://', '');
    }
    // 如果是 content:// (Android)，可能需要先 copy 到 cache
    if (sourcePath.startsWith('content://')) {
        const destPath = `${RNFS.CachesDirectoryPath}/temp_docx_${Date.now()}.docx`;
        await RNFS.copyFile(sourcePath, destPath);
        sourcePath = destPath;
    }

    await unzip(sourcePath, tempDir);

    // 3. 读取 word/document.xml
    const documentXmlPath = `${tempDir}/word/document.xml`;
    const exists = await RNFS.exists(documentXmlPath);
    
    if (!exists) {
      throw new Error('Invalid docx file: word/document.xml not found');
    }

    const xmlContent = await RNFS.readFile(documentXmlPath, 'utf8');

    // 4. 解析 XML 提取文本
    // 策略：先按段落 <w:p> 分割，再在段落内提取 <w:t>
    // 这样可以保证换行正确，且避免正则跨度过大匹配到无关 XML
    const paraRegex = /<w:p[\s\S]*?>(.*?)<\/w:p>/g;
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    
    let fullText = '';
    let paraMatch;

    while ((paraMatch = paraRegex.exec(xmlContent)) !== null) {
      const paraContent = paraMatch[1];
      let paraText = '';
      let textMatch;
      
      while ((textMatch = textRegex.exec(paraContent)) !== null) {
        paraText += textMatch[1];
      }
      
      if (paraText) {
        fullText += paraText + '\n';
      }
    }

    // 简单的 XML 实体解码
    fullText = fullText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");


    // 5. 清理临时文件
    await RNFS.unlink(tempDir);
    if (sourcePath.includes('temp_docx_')) {
        await RNFS.unlink(sourcePath);
    }

    return fullText;
  } catch (error) {
    console.error('Error reading docx:', error);
    throw error;
  }
}
