"use client";

import { useEffect } from "react";
import * as ort from "onnxruntime-web";
import * as NextImage from "next/image";

// jimpの読み込み
// https://github.com/jimp-dev/jimp/issues/1194
import * as _Jimp from "jimp";

// @ts-ignore
const Jimp = typeof self !== "undefined" ? self.Jimp || _Jimp : _Jimp;

export default function Home() {
  useEffect(() => {
    predict();
  }, []);
  return (
    <div>
      <h1>ONNX Example</h1>
      <NextImage.default // Imageを使用して名前がぶつかったので対処
        src="/vercel.svg"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
    </div>
  );
}

async function imageToFloat32Array(imagePath: string) {
  const image = await Jimp.read(imagePath);
  const resized = image.resize(28, 28).grayscale(); // MNISTのサイズに合わせてリサイズ、グレースケール化
  const float32Array = new Float32Array(28 * 28);
  let i = 0;
  resized.scan(
    0,
    0,
    resized.bitmap.width,
    resized.bitmap.height,
    function (x, y, idx) {
      const red = resized.bitmap.data[idx + 0];
      float32Array[i] = red / 255.0; // Normalize to [0, 1]
      i++;
    }
  );
  return float32Array;
}

// 画像データを使用してONNXモデルで推論する関数
async function predictWithOnnxModel(imagePath: string, modelPath: string) {
  const float32Array = await imageToFloat32Array(imagePath);
  const model = await ort.InferenceSession.create(modelPath);
  const inputTensor = new ort.Tensor("float32", float32Array, [1, 1, 28, 28]); // [1, 1, 28, 28]はMNISTモデルの入力次元
  const outputs = await model.run({ Input3: inputTensor });
  // const outputTensor = outputs.Output3;
  console.log(outputs);

  const outputTensor = outputs["Plus214_Output_0"];

  // 出力データからFloat32Arrayを作成
  const data = new Float32Array(Object.values(outputTensor.cpuData));

  // 最大値のインデックスを見つける
  const prediction = data.indexOf(Math.max(...data));

  console.log(`Predicted digit is: ${prediction}`);
}

async function predict() {
  await predictWithOnnxModel("/tegaki_5.png", "/mnist-12.onnx");
  // mnist-12-int8.onnxだと出力のデータが異なるので、上のコードには対応しない
}
