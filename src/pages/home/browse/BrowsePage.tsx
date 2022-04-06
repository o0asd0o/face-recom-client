import { useFaceRecognition } from "context/faceRecognitionProvider";
import React from "react";
import { useAuth } from "context/authContext";
import MainPage from "./MainPage";


const BrowsePage: React.FC = () => {
    const { userInfo } = useAuth();
    const { currentEmotion } = useFaceRecognition();

    return <MainPage preferences={userInfo?.preferences || []} currentEmotion={currentEmotion} />
};

export default BrowsePage;