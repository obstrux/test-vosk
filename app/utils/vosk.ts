import * as vosk from 'react-native-vosk';

// ...

export async function loadVoskModel(modelPath: string, onResult: (res: string) => void) {
  console.log("加载模型目录：", modelPath);

  await vosk.loadModel(modelPath);
  vosk.start()
    .then(() => {
      console.log('smile:🚀 ~ f:vosk m: l:11->', 'then');
      const resultEvent = vosk.onResult((res) => {
        console.log('A onResult event has been caught: ' + res);
        onResult(res);
      });
    });

}
