import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonLoading,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useLocation } from "react-router-dom";
import React from "react";

import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import TabBar from "./components/navigation/TabBar";
import Favorites from "./pages/Favorites";
import InfoPage from "./pages/InfoPage";
import EventsPage from "./pages/Events";

// import Profile from './pages/Profile';
// import Info from './pages/Info';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";
import "./theme/main.css";

import useFirebase from "./firebase/useFirebase";
import {
  IonStorageContext,
  IonStorageProvider,
} from "./contexts/StorageContext";

setupIonicReact();

const AppInner: React.FC = () => {
  const location = useLocation();
  const { handleAnswerOnRedirect, auth } = useFirebase();

  const context = React.useContext(IonStorageContext);

  // Type guard for context
  if (!context) {
    return <IonLoading isOpen={true} message="Loading..." />;
  }

  const {
    userData,
    handleOnCreateNewEntry,
    handleOnGetAnExistingStore,
    isReady,
    isGuest,
  } = context;

  // Tab bar visibility
  const showTabBar = ["/home", "/favorites", "/info"].includes(
    location.pathname,
  );

  // Handle Firebase redirect
  // React.useEffect(() => {
  //   handleAnswerOnRedirect();
  // }, [auth]);

  // Spinner visibility control
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (loading) {
    return (
      <IonLoading
        isOpen={loading}
        message={"Loading..."}
        spinner="crescent"
        translucent={true}
        showBackdrop={true}
        cssClass="custom-loading"
      />
    );
  }

  return (
    <>
      <IonRouterOutlet>
        <Route path="/login">
          {userData === null ? <Login /> : <Redirect to="/home" />}
        </Route>

        <Route path="/home">
          {userData === null ? <Redirect to="/login" /> : <Home />}
        </Route>

        <Route exact path="/favorites">
          {userData === null ? <Redirect to="/login" /> : <Favorites />}
        </Route>

        <Route exact path="/info">
          {userData === null ? <Redirect to="/login" /> : <InfoPage />}
        </Route>

        <Route exact path="/events">
          {userData === null ? <Redirect to="/login" /> : <EventsPage />}
        </Route>

        {/* <Route exact path="/profile">
          {userData === null ? <Redirect to="/login" /> : <Profile />}
        </Route> */}

        <Route exact path="/onboarding">
          <Onboarding />
        </Route>

        <Route exact path="/">
          <Redirect to="/onboarding" />
        </Route>
      </IonRouterOutlet>

      {showTabBar && <TabBar />}
    </>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonStorageProvider>
        <AppInner />
      </IonStorageProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
