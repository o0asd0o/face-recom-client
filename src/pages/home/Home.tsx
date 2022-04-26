import AppLayout from "components/AppLayout";
import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationProvider } from "context/navigationContext";
import { FaceRecognitionProvider } from "context/faceRecognitionProvider";

const Home: React.FC = () => {
  return (
    <NavigationProvider>
      <FaceRecognitionProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </FaceRecognitionProvider>
    </NavigationProvider>
  );
};

export default Home;
