import RNFS from "react-native-fs";
import { unzip } from "react-native-zip-archive";

// https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
// https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip
export const MODEL_ZIP_URL_CN = "https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip";
export const MODEL_ZIP_URL_EN = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip";

export const LOCAL_ZIP_PATH_CN = `${RNFS.DocumentDirectoryPath}/vosk-cn.zip`;
export const LOCAL_ZIP_PATH_EN = `${RNFS.DocumentDirectoryPath}/vosk-en.zip`;

export async function downloadModel(downloadUrl: string, localZipPath: string, onProgress) {
  console.log('smile:🚀 ~ f:download m:downloadModel l:13-> downloadUrl:', downloadUrl);
  const modelDir = localZipPath.replace('.zip', '');
  const modelDirExists = await RNFS.exists(modelDir);
  if (modelDirExists) {
    // await RNFS.unlink(modelDir);
  }

  const promise =  RNFS.downloadFile({
    fromUrl: downloadUrl,
    toFile: localZipPath,
    progress: ({ contentLength, bytesWritten }) => {
      console.log('smile:🚀 ~ f:download m:progress l:19-> percent:', bytesWritten, contentLength);
      const percent = bytesWritten / contentLength;
      onProgress?.(percent);
    }
  }).promise

  const res = await promise;
  console.log('smile:🚀 ~ f:download m:downloadModel l:30-> res:', res);



  // 解压模型文件
  await unzip(localZipPath, modelDir);

  return {
    modelDir,
  };
}
