import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonTitle,
  IonText,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import React, { useContext } from "react";
import { IonStorageContext } from "../contexts/StorageContext";

/*************************
 ******** INFO ********
 *********************** */

const Info: React.FC = () => {
  /*************************
   ********** VARS ***********
   *********************** */
  const context = useContext(IonStorageContext);
  if (!context) throw new Error("IonStorageContext not initialized");
  const { handleOnCreateNewEntry } = context;

  const router = useIonRouter();

  /*************************
   ******** FUNCTIONS ********
   *********************** */
  const handleLogout = async () => {
    await handleOnCreateNewEntry("user", null);
    router.push("/login", "root");
  };

  useIonViewWillEnter(() => {
    // Any view-enter logic if needed
  });

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="bg-black text-white flex flex-col items-center justify-center px-6 py-12 relative"
      >
        {/* Main Info Section */}
        <div className="flex flex-col h-full items-center justify-center text-center gap-2 z-10">
          {/* Oakwood CS Club Image */}
          <div className="w-24 h-24 rounded-xl mb-3 overflow-hidden shadow-lg border border-white/20">
            <img
              src="https://i.ibb.co/LX7TBsx3/oakwoodcomputerscience.jpg"
              alt="Oakwood Computer Science Club"
              className="w-full h-full object-cover "
            />
          </div>

          {/* Title */}
          <IonText className="text-2xl font-bold text-white w-full">
            Oakwood University CS App
          </IonText>

          <p className="text-md text-white/70 max-w-md">
            Thank you for trying our app! This is the beta version. Hoping you
            enjoy it!
          </p>

          {/* Logout Button */}
          <IonButton
            className="mt-2 w-3/4 h-[50px] !flex !justify-center !items-center"
            style={{
              "--background": "#ef4444",
              "--color": "white",
              "--border-radius": "9999px",
              fontWeight: "bold",
            }}
            onClick={handleLogout}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Log Out
          </IonButton>
        </div>

        {/* Version Text at Bottom Center */}
        <div className="absolute bottom-8 w-full text-center text-white/50 text-sm z-10">
          Version 1.0.0
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Info;

/*************************
Footer Comment
**************************
This application was developed by:
- Onell Dishmey: https://github.com/On3l7d15h
- Ramy Campusano: https://github.com/Daniels-not
**************************/
