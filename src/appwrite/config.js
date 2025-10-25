import { Client, Account, Databases } from 'appwrite';

// This is the "phone line" to your Appwrite backend
const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_API_ENDPOINT) // Your Appwrite Endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);    // Your project ID

// This creates services that you can use in your app
export const account = new Account(client);
export const databases = new Databases(client);
