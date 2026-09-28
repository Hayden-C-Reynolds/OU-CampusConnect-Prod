import React, { createContext, useState, useEffect } from "react";
import { User } from "../types/user";
import { Storage } from "@ionic/storage";
import { GUEST_USER_ID } from "../constant";

/*************************
 ***** CREATE CONTEXT ******
 *************************/
interface IonStorageContextProps {
  userData: User | null; // Current logged-in user data
  handleOnCreateNewEntry: (keyName: string, value: any) => Promise<void>; // Function to create or update an entry in storage
  handleOnGetAnExistingStore: (keyName: string) => Promise<any>; // Function to get existing entry from storage
  isReady: boolean; // Indicates whether storage is initialized
  isGuest: boolean; // Indicates whether the current user is a guest
  setUserData: any;
}

// export const IonStorageContext = createContext<IonStorageContextProps | null>(null);
const noop = async () => {};

export const IonStorageContext = createContext<IonStorageContextProps>({
  userData: null,
  handleOnCreateNewEntry: noop,
  handleOnGetAnExistingStore: async () => null,
  isReady: false,
  isGuest: false,
  setUserData: null,
});

/*************************
 ******* ION PROVIDER *******
 *************************/
export const IonStorageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /*************************
   *********** VARS **********
   ***********************/
  const [userData, setUserData] = useState<User | null>(null); // Holds the user object
  const [store, setStore] = useState<Storage | null>(null); // Holds the storage instance
  const [isReady, setIsReady] = useState(false); // Storage ready flag
  const [isGuest, setIsGuest] = useState(false); // Guest user flag

  /*************************
   ******** INIT STORAGE ********
   ***********************/
  useEffect(() => {
    const initStorage = async () => {
      try {
        const storage = new Storage(); // Create storage instance
        const storageInstance = await storage.create(); // Initialize storage
        setStore(storageInstance); // Save storage instance in state
        setIsReady(true); // Mark storage as ready
        console.log("Storage initialized successfully");

        // Load existing user if any
        const existingUser = await storageInstance.get("user");
        if (existingUser && !userData) {
          setUserData(existingUser);
          setIsGuest(existingUser.id === GUEST_USER_ID);
        }
      } catch (error) {
        console.error("Failed to initialize storage:", error);
      }
    };

    initStorage();
  }, []);

  /*************************
   ******** FUNCTIONS ********
   ***********************/

  /**
   * Create or update an entry in storage
   * If storage is not ready, retry until it is.
   */
  const handleOnCreateNewEntry = async (keyName: string, value: any) => {
    if (!store || !isReady) {
      console.warn("Storage not ready yet, retrying in 100ms...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return handleOnCreateNewEntry(keyName, value); // Retry recursively
    }

    try {
      await store.set(keyName, value); // Save data to storage

      // Keep the guest flag in sync both ways: true for a guest session,
      // false for a real account, and false when clearing the session
      // (value is null, e.g. on log out).
      if (keyName === "user") {
        setIsGuest(value?.id === GUEST_USER_ID);
      }

      // Update userData state
      setUserData(value);

      // Optional: push to home page
      // router.push("/home", "forward")
    } catch (e) {
      console.error(`Error saving to storage: ${e}`);
    }
  };

  /**
   * Get an existing entry from storage
   * If storage is not ready, retry until it is.
   */
  const handleOnGetAnExistingStore = async (keyName: string) => {
    if (!store || !isReady) {
      console.warn("Storage not ready yet, retrying in 100ms...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return handleOnGetAnExistingStore(keyName); // Retry recursively
    }

    try {
      const data = await store.get(keyName);
      return data; // Return the retrieved value
    } catch (e) {
      console.error(`Error getting value from storage: ${e}`);
      return null;
    }
  };

  /*************************
   ********* EFFECTS *********
   ***********************/
  // No extra effects needed here; storage initialization is handled above

  /*************************
   ********* RETURN CONTEXT *********
   ***********************/
  return (
    <IonStorageContext.Provider
      value={{
        userData,
        handleOnCreateNewEntry,
        handleOnGetAnExistingStore,
        isReady,
        isGuest,
        setUserData,
      }}
    >
      {children}
    </IonStorageContext.Provider>
  );
};
