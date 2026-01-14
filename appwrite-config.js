const { Client, Account, Functions, ID } = Appwrite;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('696750780007c6fc4cba'); // Corrected Project ID from your dashboard

const account = new Account(client);
const functions = new Functions(client); // Added Functions to talk to MongoDB
