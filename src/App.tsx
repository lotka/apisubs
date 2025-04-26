import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
// import { toBlobURL, fetchFile } from "@ffmpeg/util";

function App() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    await ffmpeg.load({
      coreURL: new URL('/assets/core-mt/package/dist/esm/ffmpeg-core.js', import.meta.url).href,
      wasmURL: new URL('/assets/core-mt/package/dist/esm/ffmpeg-core.wasm', import.meta.url).href,
      workerURL: new URL('/assets/core-mt/package/dist/esm/ffmpeg-core.worker.js', import.meta.url).href,
    });
    
    setLoaded(true);
  };

  const transcode = async () => {
    const videoURL =
      "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi";
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.avi", await fetchFile(videoURL));
    await ffmpeg.exec(["-i", "input.avi", "output.mp4"]);
    const fileData = await ffmpeg.readFile("output.mp4");
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
    }
  };

  return loaded ? (
    <>
      <video ref={videoRef} controls></video>
      <br />
      <button onClick={transcode}>Transcode avi to mp4</button>
      <p ref={messageRef}></p>
    </>
  ) : (
    <button onClick={load}>Load ffmpeg-core</button>
  );
}

export default App;
