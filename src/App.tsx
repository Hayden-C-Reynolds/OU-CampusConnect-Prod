import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useLocation } from "react-router-dom";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import TabBar from "./components/navigation/TabBar";
import Favorites from "./pages/Favorites";
import InfoPage from "./pages/InfoPage";
import EventsPage from "./pages/Events";
import DepartmentsPage from "./pages/Departments";
import Directions from "./pages/Directions";
import Profile from "./pages/Profile";
import { TermsPage, PrivacyPage } from "./pages/Legal";
import OfflineBanner from "./components/Alerts/OfflineBanner";
import SplashScreen from "./components/Loaders/SplashScreen";

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
import "@ionic/react/css/palettes/dark.class.css";
import "./theme/variables.css";
import "./theme/main.css";

import useFirebase from "./firebase/useFirebase";
import {
  IonStorageContext,
  IonStorageProvider,
} from "./contexts/StorageContext";

setupIonicReact();

// ── Logged-out tree ──
// Its own IonRouterOutlet, only ever mounted while userData is null.
const LoggedOutApp: React.FC = () => (
  <IonRouterOutlet>
    <Route exact path="/login">
      <Login />
    </Route>
    <Route exact path="/terms">
      <TermsPage />
    </Route>
    <Route exact path="/privacy">
      <PrivacyPage />
    </Route>
    {/* Any other path while logged out (a stale "/profile" left over from
        before logging out, "/", etc.) — just show Login. */}
    <Route>
      <Redirect to="/login" />
    </Route>
  </IonRouterOutlet>
);

// ── Logged-in tree ──
// Its own separate IonRouterOutlet, only ever mounted while userData is
// set. Because it's a fresh outlet instance every time someone logs in,
// there's no leftover Ionic page-stack from the logged-out tree to get
// confused by — every page starts clean.
const LoggedInApp: React.FC = () => {
  const location = useLocation();
  const showTabBar = ["/home", "/favorites", "/profile", "/info"].includes(
    location.pathname,
  );

  return (
    <>
      <OfflineBanner />
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/favorites">
          <Favorites />
        </Route>
        <Route exact path="/info">
          <InfoPage />
        </Route>
        <Route exact path="/events">
          <EventsPage />
        </Route>
        <Route exact path="/departments">
          <DepartmentsPage />
        </Route>
        <Route exact path="/directions">
          <Directions />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/terms">
          <TermsPage />
        </Route>
        <Route exact path="/privacy">
          <PrivacyPage />
        </Route>
        {/* Any other path while logged in ("/login" left over from before
            signing in, "/", a bad deep link) — just show Home. */}
        <Route>
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>

      {showTabBar && <TabBar />}
    </>
  );
};

const AppInner: React.FC = () => {
  const { handleAnswerOnRedirect, auth } = useFirebase();
  const context = React.useContext(IonStorageContext);

  // Context may not be ready on the very first render. Destructure with
  // safe fallbacks instead of bailing out early — every hook below must
  // run unconditionally, on every render, in the same order, so an early
  // `return` before them (React's Rules of Hooks) is not allowed here.
  const { userData = null, isReady = false } = context ?? {};

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

  // Context isn't ready yet — show the splash screen. This check happens
  // AFTER all hooks above have run, so hook order stays identical on
  // every render regardless of when context becomes available.
  if (!context || loading) {
    return <SplashScreen />;
  }

  return userData === null ? <LoggedOutApp /> : <LoggedInApp />;
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Analytics />
      <IonStorageProvider>
        <AppInner />
      </IonStorageProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;