// import { 
//   IonButton, 
//   IonContent, 
//   IonIcon, 
//   IonInput, 
//   IonList, 
//   IonNote, 
//   IonPage, 
//   IonTitle, 
//   IonToast, 
//   useIonRouter,
//   useIonViewWillEnter
// } from '@ionic/react';
// import { fingerPrint, heartOutline, logoGoogle, logoMicrosoft, logOutOutline, mail, person, saveOutline } from "ionicons/icons"
// import React from 'react';
// import useFirebase from '../firebase/useFirebase';
// import { IonStorageContext } from '../contexts/StorageContext';
// import { campusLocations } from '../types/locations';

// /*************************
// ******** PROFILE ********
// *********************** */


// const Profile: React.FC = () => {
  
//     /*************************
//     ********** VARS ***********
//     *********************** */
//     const { userData } = React?.useContext(IonStorageContext);
//     const [favorites, setFavorites] = React?.useState<any>()
//     const FAVORITES_KEY = "campus_favorites_v1";
//     const FAVORITES_TOUR_KEY = "favorites_tour_v1"; 

//     /*************************
//     ********** VARS ***********
//     *********************** */
//     const router = useIonRouter();
//     const { handleOnCreateNewEntry } = React?.useContext(IonStorageContext)

//     /*************************
//     ******** FUNCTIONS ********
//     *********************** */
//     const randomBGColorSelect = () => {

//     }

//     React?.useEffect(() => {
//     }, [])

//       useIonViewWillEnter(() => {
//         const raw = localStorage.getItem(FAVORITES_KEY);
//         if (raw) {
//           try {
//             const favIds: string[] = JSON.parse(raw);
//             const favLocations = campusLocations.filter((loc) => favIds.includes(loc.id));
//             setFavorites(favLocations);
//           } catch {
//             setFavorites([]);
//           }
//         } else {
//           setFavorites([]);
//         }
    
//         // const seen = localStorage.getItem(FAVORITES_TOUR_KEY);
//         // if (!seen) setTimeout(() => setTourOpen(true), 300);
//       });

//     return (
//         <IonPage>
//             <IonContent fullscreen className={`bg-black text-white`}>
//                 <div className={`w-full flex flex-col justify-center items-center`}>
                    
//                     {/* TITLE */}
//                     <section className="w-full h-[10vh] flex flex-row justify-start items-center">
//                         <IonTitle className="text-2xl mt-2 font-bold mb-2 text-white indent-4 ">
//                             Profile
//                         </IonTitle>
//                     </section>

//                     {/* DECORATION STUFF */}
//                     <div className="bg-white/10 w-full h-full rounded-t-2xl">

//                         {/* IMAGE AND DETAILS */}
//                         <section className="w-full flex flex-row justify-start items-center p-4 gap-5">
//                             <div className="md:w-32 w-30 md:h-32 h-30 bg-white rounded-xl overflow-hidden">
//                                 {
//                                     userData["profilePic"] === null
//                                     ?
//                                         <div className="!w-full !h-full text-7xl font-bold bg-[#FAA533]
//                                         flex justify-center items-center">
//                                             {userData["email"].substr(0, 1)}
//                                         </div>
//                                     :
//                                     <img 
//                                         src={userData["profilePic"]}
//                                         alt=""
//                                         className="w-full h-full"
//                                     />
//                                 }
//                             </div>

//                             <div className="w-2/4">
//                                 <IonTitle className="sm:text-4xl text-2xl font-bold m text-white">
//                                     {
//                                         userData["fullName"] === null
//                                         ? 
//                                             userData["email"].split("@")[0]
//                                         :
//                                         userData["fullName"]
//                                     }
//                                 </IonTitle>
//                                 <p className="text-sm opacity-[.5] w-full text-white my-0">
//                                   {userData["email"]}
//                                 </p>
//                             </div>
//                         </section>

//                         {/* SECTION OF ACTIONS */}
//                         <section className="w-full justify-start items-center p-4 gap-5 -mt-6">
//                             <div className="w-full flex sm:flex-row justify-center items-center gap-4">
//                                 <IonButton
//                                     className="w-1/2 h-[45px] mt-4 !flex !justify-center !items-center"
//                                     fill='clear'
//                                     style={{
//                                         "--background": "white",
//                                         "--border-radius": "9999px",
//                                         fontWeight: "bold",
//                                         "--color": "#000000",
//                                     }}
//                                     onClick={() => router.push("/favorites", "forward")}
//                                 >
//                                     <IonIcon
//                                         icon={heartOutline}
//                                         className="text-2xl"
//                                     />
//                                     <span className="ml-2 sm:inline hidden">Favorites</span>
//                                 </IonButton>

//                                 <IonButton
//                                     className="w-1/2 h-[45px] mt-4 !flex !justify-center !items-center"
//                                     fill='clear'
//                                     style={{
//                                         "--background": "white",
//                                         "--border-radius": "9999px",
//                                         fontWeight: "bold",
//                                         "--color": "#000000",
//                                     }}
//                                     onClick={() => handleOnCreateNewEntry("user", null)}
//                                 >
//                                     <IonIcon
//                                         icon={logOutOutline}
//                                         className="text-2xl"
//                                     />
//                                     <span className="ml-2 sm:inline hidden">Log out</span>
//                                 </IonButton>
//                             </div>
//                         </section>

//                         {/* SECTION OF ACTIONS */}
//                         <section className="w-full flex flex-col justify-start items-center p-4 gap-5 -mt-2">
//                             <div className="w-full flex flex-row justify-center items-center gap-4">
//                                 <IonTitle className="text-xl font-bold m text-white">
//                                     App info
//                                 </IonTitle>

//                                 <span className="w-full border-2 border-white/50 h-[2px] rounded">

//                                 </span>
//                             </div>

//                             {/* <div>
//                                 <p className="text-md text-white/50 text-justify">
//                                     This application was developed by Onell Dishmey and Ramy Campusano
//                                     and is currently in the version 1.0.0
//                                 </p>
//                             </div>

//                             <div className="w-full flex flex-row justify-center items-center ">
                                
//                                 <div className="w-24 h-24 rounded-full overflow-hidden border border-2 border-transparent translate-x-[10px]">
//                                     <img 
//                                         src="src/assets/images/onell.jpg"
//                                         alt=""
//                                         className="scale-[1.5]"
//                                     />
//                                 </div>

//                                 <div className="w-24 h-24 rounded-full overflow-hidden border border-2 border-transparent translate-x-[-10px]">
//                                     <img 
//                                         src="src/assets/images/ramy.jpeg"
//                                         alt=""
//                                     />
//                                 </div>

//                             </div> */}
//                         </section>

//                         <section className="w-full h-[100px]">

//                         </section>
//                     </div>
//                 </div>
//             </IonContent>
//         </IonPage>
//     );
// };

// export default Profile;
