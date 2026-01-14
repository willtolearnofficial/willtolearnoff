// Initialize the Appwrite client
const { Client, Account, Databases, ID } = Appwrite;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Standard Appwrite Cloud endpoint
    .setProject('69673baf001051163ba7');         // Your specific Project ID

const account = new Account(client);
const databases = new Databases(client);

// Exporting these so you can use them in other files if needed
// If you're not using modules, you can just keep them as global variables
