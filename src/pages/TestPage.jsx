import React, { useState, useRef } from 'react';
import { account, databases } from '../appwrite/config';
import { ID, Permission, Role } from 'appwrite';

function TestPage() {
  const [message, setMessage] = useState('Follow the steps below to test the sign-up flow.');
  const [isLoading, setIsLoading] = useState(false);
  // We will use a ref to store the new user's data between steps
  const newUserRef = useRef(null); 
  const userCredentials = useRef({
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123'
  });

  // --- TEST STEP 1: Create the User Account ---
  const step1_createUser = async () => {
    setIsLoading(true);
    setMessage('Step 1: Creating a new user account...');
    console.log("--- STARTING STEP 1: CREATE USER ---");
    try {
      const newUser = await account.create(ID.unique(), userCredentials.current.email, userCredentials.current.password);
      newUserRef.current = newUser; // Save the new user's data
      console.log("Step 1 SUCCESS:", newUser);
      setMessage(`Step 1 SUCCESS: User created with ID: ${newUser.$id}. Now proceed to Step 2.`);
    } catch (error) {
      console.error(">>> STEP 1 FAILED:", error);
      setMessage(`Error in Step 1: ${error.message}. Check console.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TEST STEP 2: Log the New User In ---
  const step2_loginUser = async () => {
    if (!newUserRef.current) {
      setMessage("Please complete Step 1 first.");
      return;
    }
    setIsLoading(true);
    setMessage('Step 2: Creating a session for the new user...');
    console.log("--- STARTING STEP 2: LOGIN USER ---");
    try {
      await account.createEmailPasswordSession(userCredentials.current.email, userCredentials.current.password);
      console.log("Step 2 SUCCESS: Session created.");
      setMessage("Step 2 SUCCESS: Session created. Now proceed to Step 3.");
    } catch (error) {
      console.error(">>> STEP 2 FAILED:", error);
      setMessage(`Error in Step 2: ${error.message}. Check console.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TEST STEP 3: Create the Progress Document ---
  const step3_createDocument = async () => {
    if (!newUserRef.current) {
      setMessage("Please complete Steps 1 and 2 first.");
      return;
    }
    setIsLoading(true);
    setMessage('Step 3: Attempting to create the UserProgress document...');
    console.log("--- STARTING STEP 3: CREATE DOCUMENT ---");
    try {
      const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const tableId = import.meta.env.VITE_APPWRITE_USERPROGRESS_TABLE_ID;
      
      const response = await databases.createDocument(
        dbId,
        tableId,
        ID.unique(),
        { userId: newUserRef.current.$id },
        [
          Permission.read(Role.user(newUserRef.current.$id)),
          Permission.update(Role.user(newUserRef.current.$id)),
          Permission.delete(Role.user(newUserRef.current.$id)),
        ]
      );
      console.log("Step 3 SUCCESS:", response);
      setMessage("Step 3 SUCCESS! Document created. The entire flow works!");
    } catch (error) {
      console.error(">>> STEP 3 FAILED:", error);
      setMessage(`Error in Step 3: ${error.message}. Check console.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Sign-Up Flow Debugger</h1>
      <p className="text-lg mb-8 text-gray-400">Click the buttons below in order to find the failure point.</p>
      
      <div className="flex flex-col gap-4">
        <button onClick={step1_createUser} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
          Step 1: Create New User
        </button>
        <button onClick={step2_loginUser} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
          Step 2: Log In New User
        </button>
        <button onClick={step3_createDocument} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg">
          Step 3: Create Progress Document
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg w-full max-w-2xl text-center">
        <p className="font-mono">{message}</p>
        <p className="text-sm text-gray-500 mt-2">A new random email will be used for this test: {userCredentials.current.email}</p>
      </div>
    </div>
  );
}

export default TestPage;

