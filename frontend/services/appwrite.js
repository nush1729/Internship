import { Client, Account } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID'); // Your project ID

export const account = new Account(client);

export const loginWithGoogle = () => {
    return account.createOAuth2Session(
        'google',
        'http://localhost:5173/dashboard', // Success URL
        'http://localhost:5173' // Failure URL
    );
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};