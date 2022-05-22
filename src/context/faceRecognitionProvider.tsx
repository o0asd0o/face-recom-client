import React, { useCallback, useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useContext } from "react";
import { createContext } from "react";
import * as faceApi from "face-api.js";
import { initializeFaceApiJS } from "_utils/helpers";
import produce from "immer";
import { Emotion } from "types";
import { fabClasses } from "@mui/material";

type Counts = Record<Emotion, number>;

type FaceRecognitionContextType =
  | {
      currentEmotion: Emotion;
      emotionCounts: Counts;
      calibrating: boolean;
      setCurrentEmotion(emotion: Emotion): void;
      setEmotionCounts(counts: Counts): void;
    }
  | undefined;

type DetectionsType = faceApi.WithFaceExpressions<{
  detection: faceApi.FaceDetection;
}>[];

const FaceRecognitionContext =
  createContext<FaceRecognitionContextType>(undefined);

export function FaceRecognitionProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [calibrating, setCalibrating] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("sad");
  const [currentMaxEmotion, setCurrentMaxEmotion] = useState<Emotion>("sad");
  const [emotionCounts, setEmotionCounts] = useState<Counts>({
    sad: 0,
    happy: 0,
  });

  const [prevMinutes, setPrevMinutes] = useState<number>();
  const { start, minutes } = useStopwatch({ autoStart: false });

  useEffect(() => {
    if (minutes !== prevMinutes) {
      setCurrentEmotion(currentMaxEmotion);
      setPrevMinutes(minutes);
    }
  }, [minutes, prevMinutes, currentMaxEmotion]);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleEmotionChange = React.useCallback(
    (detections: DetectionsType) => {
      detections.map(({ expressions }) => {
        const maxValue = Math.max(expressions["happy"], expressions["sad"]);

        const arrayEntries = Object.entries(expressions)
          .map(([key, value]) => ({ key, value: String(value) }))
          .filter(({ key }) => ["happy", "sad"].includes(key));

        const emotion = arrayEntries.find(
          ({ value }) => String(maxValue) === value
        ) ?? { key: "none" };
        const emotionKey = emotion.key as Emotion;
        setEmotionCounts(
          produce((emotionCounts) => {
            emotionCounts[emotionKey] += 1;

            const max = Math.max(emotionCounts["happy"], emotionCounts["sad"]);

            const entries = Object.entries(emotionCounts);
            const maxEmotion = entries.find(([, value]) => max === value);

            if (maxEmotion && currentEmotion !== maxEmotion[0]) {
              setCurrentMaxEmotion(maxEmotion[0] as Emotion);
            }
          })
        );
      });
    },
    [setCurrentMaxEmotion, currentEmotion]
  );

  // const handleMaxEmotionChange = useCallback(() => {
  //   setCurrentEmotion(currentMaxEmotion);
  // }, [currentMaxEmotion]);

  useEffect(() => {
    if (!calibrating) {
      start();
    }
  }, [calibrating]);

  React.useEffect(() => {
    const x = setTimeout(() => {
      setCalibrating(false);
    }, 5000);
    return () => clearTimeout(x);
  }, []);

  React.useEffect(() => {
    let interval: any;
    initializeFaceApiJS(faceApi, videoRef).then(() => {
      if (videoRef.current && canvasRef.current) {
        const displaySize = {
          width: videoRef.current?.width || 0,
          height: videoRef.current?.height || 0,
        };
        faceApi.matchDimensions(canvasRef.current, displaySize);
        interval = setInterval(async () => {
          const detections =
            (await faceApi
              .detectAllFaces(
                videoRef.current!,
                new faceApi.TinyFaceDetectorOptions()
              )
              .withFaceExpressions()) || [];

          if (canvasRef.current) {
            const resizedDetections = faceApi.resizeResults(
              detections,
              displaySize
            );
            // @ts-expect-error
            canvasRef.current
              .getContext("2d")
              .clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );

            faceApi.draw.drawDetections(canvasRef.current, resizedDetections);
            handleEmotionChange(detections);
          }
        }, 300);
      }
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <FaceRecognitionContext.Provider
      value={{
        currentEmotion,
        emotionCounts,
        calibrating,
        setCurrentEmotion,
        setEmotionCounts,
      }}
    >
      <>
        <video ref={videoRef} width="440" height="330" autoPlay hidden />
        <canvas className="webcam-overlay" ref={canvasRef} hidden />
      </>
      {children}
    </FaceRecognitionContext.Provider>
  );
}

export function useFaceRecognition() {
  const context = useContext(FaceRecognitionContext);

  if (context === undefined) {
    throw new Error(
      "useHomeFaceRecognition must be used within an FaceRecognitionProvider"
    );
  }

  return context;
}
