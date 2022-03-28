import * as faceApi2 from "face-api.js";

const MODEL_URL = `/models`;

export const validateFileSize = (file: File) => {
    if (file) {
        return file.size <= 1100000;
    } else {
        return true;
    }
};

export const initializeFaceApiJS = async (faceApi: typeof faceApi2, videoRef: any) => {
    await Promise.all([
        faceApi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    ]);

    if (navigator.mediaDevices.getUserMedia) {
        // get the webcam's video stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream;
    }

    return Promise.resolve();
}