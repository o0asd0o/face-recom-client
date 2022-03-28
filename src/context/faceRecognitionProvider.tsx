import React, { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import * as faceApi from "face-api.js";
import {initializeFaceApiJS} from "utils/helpers";

type Emotion = "sad" | "angry" | "surprise" | "happy" | "neutral";
type Counts = {
    sad: number;
    happy: number;
    anger: number;
    surprised: number;
};
type FaceRecognitionContextType = {
    currentEmotion: Emotion;
    emotionCounts: Counts;
    setCurrentEmotion(emotion: Emotion): void;
    setEmotionCounts(counts: Counts): void;
} | undefined

type DetectionsType = faceApi.WithFaceExpressions<{
    detection: faceApi.FaceDetection;
}>[];

const FaceRecognitionContext = createContext<FaceRecognitionContextType>(undefined);

export function FaceRecognitionProvider({ children }: { children: JSX.Element }) {
    const [currentEmotion, setCurrentEmotion] = useState<Emotion>("sad");
    const [emotionCounts, setEmotionCounts] = useState<Counts>({
        sad: 0,
        happy: 0,
        anger: 0,
        surprised: 0
    });

    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const handleEmotionChange = React.useCallback((detections: DetectionsType) => {
        detections.map(({expressions}) => {
            const maxValue = Math.max(
                expressions['happy'], 
                expressions['sad'],
                // expressions['neutral'],
                expressions['surprised'],
                expressions['angry'],
            )

            const arrayEntries = Object.entries(expressions)
                .map(([key, value]) => ({ key, value: String(value) }))
                .filter(({ key }) => ['happy', 'sad', 'angry', 'surprised'].includes(key));

            const emotion = arrayEntries.find(({value}) => String(maxValue) === value) ?? {key: "none"};

            setCurrentEmotion(emotion.key as Emotion);
        })
    }, [setCurrentEmotion]);

    console.log({ currentEmotion });


    React.useEffect(() => {
        let interval: any;
        initializeFaceApiJS(faceApi, videoRef).then(() => {
            if (videoRef.current && canvasRef.current) {
                const displaySize = { width: videoRef.current?.width || 0, height: videoRef.current?.height || 0 }
                faceApi.matchDimensions(canvasRef.current, displaySize)
                interval = setInterval(async () => {
                    const detections = await faceApi.detectAllFaces(
                        videoRef.current!,
                        new faceApi.TinyFaceDetectorOptions()
                    ).withFaceExpressions() || [];

                    if (canvasRef.current) {
                        const resizedDetections = faceApi.resizeResults(detections, displaySize);
                        // @ts-expect-error
                        canvasRef.current.getContext('2d')
                            .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        
                        faceApi.draw.drawDetections(canvasRef.current, resizedDetections)
                        // faceApi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
        
                        handleEmotionChange(detections);
                    }
                }, 200)
            }
            
          })

        return () => {
            clearInterval(interval)
        }
    }, []);

    return (
        <FaceRecognitionContext.Provider value={{
            currentEmotion,
            emotionCounts,
            setCurrentEmotion,
            setEmotionCounts
         }}>
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
    throw new Error("useHomeFaceRecognition must be used within an FaceRecognitionProvider");
  }

  return context;
}
