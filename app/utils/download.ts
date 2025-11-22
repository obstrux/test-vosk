import RNFS from "react-native-fs";
import { unzip } from "react-native-zip-archive";

export const MODEL_ZIP_URL_CN = "https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip";
export const MODEL_ZIP_URL_EN = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip";


export async function downloadModel(downloadUrl: string, onProgress: (percent: number) => void) {

  const modelName = downloadUrl.split('/').pop()!.replace('.zip', '')
  const modelDownDir = `${RNFS.DocumentDirectoryPath}/${modelName}`;
  const modelDirExists = await RNFS.exists(modelDownDir);
  if (modelDirExists) {
    const files = await RNFS.readDir(modelDownDir);
    if (files.length > 0) {
      console.log('Model already exists, skipping download.',  files[0].path);
      return {
        modelDir: files[0].path, // 解压后的模型地址
      };
    }
  }

  const downloadFilePath = `${RNFS.DocumentDirectoryPath}/${modelName}.zip`;

  const promise =  RNFS.downloadFile({
    fromUrl: downloadUrl,
    toFile: downloadFilePath,
    begin: () => {
      console.log('smile:🚀 ~ f:download m:begin l:24->', '开始下载');
    },
    progress: ({ contentLength, bytesWritten }) => {
      const percent = bytesWritten / contentLength;
      onProgress?.(percent);
    }
  }).promise

  await promise;

  // 解压模型文件
  await unzip(downloadFilePath, modelDownDir);

  // 清理下载的zip文件
  await RNFS.unlink(downloadFilePath);

  const files = await RNFS.readDir(modelDownDir);

  return {
    modelDir: files[0]?.path,
  };
}
