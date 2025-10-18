**Section 	: 	C**

**Reg\#		: 	FA23-BCS-170**

# **Name		: 	Zaid Ali**

# **Advanced Database**

**Midterm Project (Group : D)**

# **Postcrossing Project**

This project is an implementation of a Postcrossing-like service, designed to fulfill the requirements of "Sample Paper D". It consists of three main components: the mongoDB schema/seed file, a backend REST API built with Node.js and Express, and a Firefox browser extension for sorting tabs.

## **Features**

### **Backend API (postcrossing-api)**

* **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).  
* **Postcard Exchange Logic:**  
  * Request a random user address to send a postcard to.  
  * Register a received postcard using its unique ID.  
* **Reciprocal Matching:** Automatically detects and logs when two users have sent postcards to each other.  
* **Profile & Stats:** Endpoints to view user profiles, sent/received postcard lists, and country-wide statistics.  
* **Database:** Uses MongoDB Atlas for a scalable and robust database solution.

### **Firefox Extension (firefox-extension)**

* **Tab Sorting:** Scans all open tabs in the current browser window.  
* **ID Recognition:** Identifies tabs that have a Postcrossing-style ID (e.g., US-12345) in their title.  
* **Numerical Sorting:** Rearranges the identified tabs from left to right, sorted in ascending order based on the numerical part of the ID.

## **Project Structure**

postcrossing-project/  
├── .gitignore  
├── README.md  
├── postcrossing-api/  
└── firefox-extension/

## **Setup and Installation**

### **1\. Backend API**

**Prerequisites:**

* Node.js and npm  
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account  
* [Postman](https://www.postman.com/downloads/) (Recommended for API testing)

**Instructions:**

1. **Clone the repository:**  
   git clone \<your-repository-url\>  
   cd postcrossing-project/postcrossing-api

2. **Install dependencies:**  
   npm install

3. **Set up environment variables:**  
   * Create a file named .env in the postcrossing-api root folder.  
   * Add the following content, replacing the placeholder values:  
     ATLAS\_URI="mongodb+srv://\<user\>:\<password\>@\<cluster-url\>/postcrossing\_db?retryWrites=true\&w=majority"  
     JWT\_SECRET="your\_super\_secret\_jwt\_key\_here"  
     PORT=5000

4. **Seed the database:**  
   * Connect to your MongoDB Atlas cluster.  
   * Run the script from playground-1.mongodb.js to populate your database with initial sample data.  
5. **Run the server:**  
   npm start

   The API will be running at http://localhost:5000.

### **2\. Firefox Extension**

1. Open the Firefox browser.  
2. Navigate to about:debugging in the address bar.  
3. Click on "**This Firefox**" on the left-hand menu.  
4. Click the "**Load Temporary Add-on…**" button.  
5. Navigate to the firefox-extension folder inside the project and select the manifest.json file.  
6. The postcard icon will appear in your Firefox toolbar.

## **API Endpoints**

The base URL is http://localhost:5000/api.

| Method | Endpoint | Auth? | Description |
| :---- | :---- | :---- | :---- |
| POST | /auth/register | No | Creates a new user account. |
| POST | /auth/login | No | Logs in a user and returns a JWT. |
| GET | /users/:userId | No | Retrieves a user's public profile. |
| GET | /users/:userId/sent | No | Gets a list of postcards sent by the user. |
| GET | /users/:userId/received | No | Gets a list of postcards received by the user. |
| POST | /postcards/request | **Yes** | Requests a recipient address and creates a new "sent" postcard record. |
| POST | /postcards/register | **Yes** | Registers a received postcard ID, updating its status. |
| GET | /countries | No | Gets a list of all countries and their sending/receiving statistics. |

