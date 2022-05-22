import { useFaceRecognition } from "context/faceRecognitionProvider";
import React from "react";
import { useAuth } from "context/authContext";
import { useHomeNavigation } from "context/navigationContext";
import MainPage from "./MainPage";
import DisabledPage from "../common/disabled/DisabledPage";

const BrowsePage: React.FC = () => {
  const { userInfo } = useAuth();
  const { currentEmotion, calibrating } = useFaceRecognition();
  const { acceptedTerm } = useHomeNavigation();

  return acceptedTerm ? (
    <MainPage
      preferences={userInfo?.preferences || []}
      currentEmotion={currentEmotion}
      calibrating={calibrating}
    />
  ) : (
    <DisabledPage />
  );
};

export default BrowsePage;
