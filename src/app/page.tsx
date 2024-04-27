"use client";

import Image from "next/image";
import { useEffect } from "react";
import * as ort from "onnxruntime-web";

export default function Home() {
  useEffect(() => {
    loadModel();
  }, []);
  return (
    <div>
      <h1>ONNX Example</h1>
      <Image
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

async function loadModel() {
  // onnxモデルを読み込む
  const loadedModel = await ort.InferenceSession.create("/mobilenetv2-7.onnx");
  console.log(loadedModel);
}
