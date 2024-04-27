import Image from "next/image";
import { useEffect } from "react";
import * as ort from "onnxruntime-web";

export default function Home() {
  useEffect(() => {
    async function loadModel() {
      // onnxモデルを読み込む
      const loadedModel = await ort.InferenceSession.create(
        "/model/model.onnx"
      );
    }
  });
  return (
    <div>
      <h1>Home</h1>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
    </div>
  );
}
