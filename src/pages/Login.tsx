// import {
//   IonButton,
//   IonContent,
//   IonIcon,
//   IonInput,
//   IonNote,
//   IonPage,
//   IonTitle,
//   IonToast,
//   useIonRouter,
// } from "@ionic/react";
// import {
//   fingerPrint,
//   logoGoogle,
//   person,
//   mail,
//   eye,
//   eyeOff,
// } from "ionicons/icons";
// import React from "react";
// import useFirebase from "../firebase/useFirebase";

// const Login: React.FC = () => {
//   const [credentials, setCredentials] = React.useState({
//     email: "",
//     id: "",
//   });
//   const [isToastOpen, setIsToastOpen] = React.useState(false);
//   const [message, setMessage] = React.useState<string>("");
//   const [showPassword, setShowPassword] = React.useState(false);

//   const router = useIonRouter();

//   const {
//     handleOnLogin,
//     handleAnswerOnRedirect,
//     handleOnLoginWithGooglePopUp,
//     handleOnLoginAsGuest,
//     auth,
//   } = useFirebase();

//   React.useEffect(() => {
//     handleAnswerOnRedirect();
//   }, [auth]);

//   const handleOnChangeInput = (e: any) => {
//     setCredentials({
//       ...credentials,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleOnSubmit = async () => {
//     if (!credentials.email) {
//       setMessage("Please provide a valid institutional email.");
//       setIsToastOpen(true);
//       return;
//     }
//     if (!credentials.id) {
//       setMessage("Please provide your password.");
//       setIsToastOpen(true);
//       return;
//     }

//     const answer = await handleOnLogin(credentials);

//     if (answer === false) {
//       setMessage(
//         "Invalid email or password. Please check your credentials."
//       );
//       setIsToastOpen(true);
//     }
//   };

//   try
//   {
//     return (
//       <IonPage>
//         <IonContent fullscreen className="bg-gray-900 text-white">
//           <div className="w-full h-full flex flex-col justify-center items-center px-4">
//             {/* TITLE AND ICON */}
//             <section className="text-center mb-10">
//               <div className="text-6xl mb-4">👤</div>
//               <IonTitle className="text-3xl font-bold mb-2">Log In</IonTitle>
//               <p className="text-base mx-auto w-3/4 text-gray-300">
//                 Please provide your credentials to access this app.
//               </p>
//             </section>

//             {/* INPUTS */}
//             <section className="w-full flex flex-col justify-center items-center gap-4">
//               {/* Email */}
//               <div className="flex items-center gap-2 w-3/4 px-4 h-[50px] rounded-full bg-gray-800 border border-gray-700 shadow-md">
//                 <IonIcon icon={mail} className="text-xl text-gray-400" />
//                 <IonInput
//                   mode="ios"
//                   className="flex-1 text-white"
//                   placeholder="Institutional Email"
//                   style={{
//                     "--color": "white",
//                     "--placeholder-color": "rgba(255,255,255,0.6)",
//                     "--background": "transparent",
//                   }}
//                   onIonInput={handleOnChangeInput}
//                   name="email"
//                 />
//               </div>

//               {/* Password with toggle */}
//               <div className="flex items-center gap-2 w-3/4 px-4 h-[50px] rounded-full bg-gray-800 border border-gray-700 shadow-md">
//                 <IonIcon icon={fingerPrint} className="text-xl text-gray-400" />
//                 <IonInput
//                   mode="ios"
//                   type={showPassword ? "text" : "password"}
//                   className="flex-1 text-white"
//                   placeholder="Password"
//                   style={{
//                     "--color": "white",
//                     "--placeholder-color": "rgba(255,255,255,0.6)",
//                     "--background": "transparent",
//                   }}
//                   onIonInput={handleOnChangeInput}
//                   name="id"
//                 />
//                 <IonIcon
//                   icon={showPassword ? eyeOff : eye}
//                   className="text-lg text-gray-400 cursor-pointer"
//                   onClick={() => setShowPassword(!showPassword)}
//                 />
//               </div>

//               {/* Submit */}
//               <IonButton
//                 className="w-3/4 h-[45px] mt-4 !flex !justify-center !items-center"
//                 fill="solid"
//                 style={{
//                   "--background": "#1f2937", // dark gray
//                   "--border-radius": "9999px",
//                   fontWeight: "bold",
//                   "--color": "white",
//                 }}
//                 onClick={handleOnSubmit}
//               >
//                 Sign In
//               </IonButton>

//               <IonToast
//                 isOpen={isToastOpen}
//                 message={message}
//                 onDidDismiss={() => setIsToastOpen(false)}
//                 duration={5000}
//                 color="dark"
//               />
//             </section>

//             {/* OTHER WAYS TO SIGN IN */}
//             <section className="text-center mt-10 w-full flex flex-col justify-center items-center gap-4">
//               <div className="w-3/4 flex flex-row justify-center items-center gap-2">
//                 <span className="w-1/4 h-[2px] bg-gray-600"></span>
//                 <IonNote className="text-gray-300">Other ways to sign in</IonNote>
//                 <span className="w-1/4 h-[2px] bg-gray-600"></span>
//               </div>

//               <div className="w-3/4 flex flex-row justify-center items-center gap-4">
//                 <IonButton
//                   className="w-1/2 h-[45px] !flex !justify-center !items-center"
//                   fill="solid"
//                   style={{
//                     "--background": "#2563eb", // blue for Google
//                     "--border-radius": "9999px",
//                     fontWeight: "bold",
//                     "--color": "white",
//                   }}
//                   onClick={handleOnLoginWithGooglePopUp}
//                 >
//                   <IonIcon icon={logoGoogle} />
//                 </IonButton>

//                 <IonButton
//                   className="w-1/2 h-[45px] !flex !justify-center !items-center"
//                   fill="solid"
//                   style={{
//                     "--background": "#374151", // dark gray for guest
//                     "--border-radius": "9999px",
//                     fontWeight: "bold",
//                     "--color": "white",
//                   }}
//                   onClick={handleOnLoginAsGuest}
//                 >
//                   <IonIcon icon={person} />
//                 </IonButton>
//               </div>
//             </section>
//           </div>
//         </IonContent>
//       </IonPage>
//     );
//   } catch(e)
//   {
//     console.error(e)
//   }
// }

// export default Login;
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { person } from "ionicons/icons";
import React from "react";
import useFirebase from "../firebase/useFirebase";
import BetaAlert from "../components/Alerts/BetaAlert";

const Login: React.FC = () => {
  const {
    // 🔒 AUTH DISABLED FOR BETA
    // handleOnLogin,
    // handleOnLoginWithGooglePopUp,
    // handleAnswerOnRedirect,
    handleOnLoginAsGuest,
    // auth,
  } = useFirebase();

  // React.useEffect(() => {
  //   handleAnswerOnRedirect();
  // }, [auth]);

  return (
    <IonPage>
      {/* 🚨 CENTERED BETA ALERT */}
      <BetaAlert />

      <IonContent fullscreen className="bg-gray-900 text-white">
        <div className="w-full h-full flex flex-col justify-center items-center px-4">

          {/* HEADER */}
          <section className="text-center mb-10">
            <div className="text-6xl mb-4">👤</div>
            <IonTitle className="text-3xl font-bold mb-2">
              Welcome
            </IonTitle>
            <p className="text-base mx-auto w-3/4 text-white-300">
              You can access the beta version as a guest.
            </p>
          </section>

          {/* GUEST BUTTON */}
          <section className="w-full flex flex-col justify-center items-center gap-4">
            <IonButton
              className="w-3/4 h-[50px] !flex !justify-center !items-center"
              fill="solid"
              style={{
                "--background": "#374151",
                "--border-radius": "9999px",
                fontWeight: "bold",
                "--color": "white",
              }}
              onClick={handleOnLoginAsGuest}
            >
              <IonIcon icon={person} className="mr-2" />
              Continue as Guest
            </IonButton>

            <p className="text-xs text-gray-400 text-center w-3/4">
              Guest users have limited access during the beta phase.
            </p>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
