# Classify
Classify allows you to effortlessly break down your Spotify playlists into different genres and vibes using the power of AI. With a seamless integration of Spotify and advanced AI capabilities, this application provides a personalized way to explore, categorize, and rediscover your music collection.


## Features
- **Spotify Integration**: Log in securely using your Spotify credentials to access your playlists and favorite tracks.  
- **AI-Based Categorization**: Harness AI to classify songs based on genres, energy levels, and more using GPT-3 for playlist names and descriptions.  
- **Interactive Interface**: Select playlists, view detailed song information, and manage your music library effortlessly.  
- **Customizable Playlists**: Automatically generate new playlists or manually adjust categories to match your preferences.  
- **Responsive UI**: Built with React for a modern, intuitive, and mobile-friendly experience.  


## Tech Stack
- **Frontend**: React.js, Bootstrap, Axios  
- **Backend**: Node.js, Express.js  
- **AI/ML**: Natural Language Processing (NLP) using GPT-3 and clustering algorithms in scikit-learn  
- **Authentication**: Spotify OAuth 2.0  
- **Deployment**: Heroku for both frontend and backend  
- **Version Control**: Git/GitHub  


## Getting Started

### Prerequisites
To run this project locally, ensure you have the following:
- Node.js and npm  
- Spotify Developer Account (for API credentials)
- OpenAI Account with Tokens (for API credentials)

### Clone the repository:
```
git clone https://github.com/thaninbew/classify.git
cd classify
```
### Install dependencies for root, frontend and backend:
```
npm install
cd frontend/
npm install
cd ../backend/
npm install
```
### Create a .env file in the backend directory with your Spotify API credentials:
```
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3001/callback
OPENAI_API_KEY=your_openai_api_key_here
```
Create a .env file in the frontend directory to configure the backend connection:
```
REACT_APP_BACKEND_URL=http://localhost:3001
```
## Running the Application

### Go to root directory:
```
npm start
```

### Start the backend server only:
```
cd backend
npm start
```
### Start the frontend server only:
```
cd frontend
npm start
```
The backend server runs on http://localhost:3001.
The frontend runs on http://localhost:3000.

## Project Structure
```
classify/
├── frontend/
│   ├── src/ (React code)
│   ├── public/ (Static assets)
│   └── package.json
├── backend/
│   ├── controllers/ (Express controllers)
│   ├── services/ (Logic for external APIs and processing)
│   ├── middlewares/ (Middleware functions)
│   ├── routes/ (Route definitions)
│   ├── index.js (Main server file)
│   └── package.json
└── README.md
```
## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
If you have any questions, suggestions, or feedback, feel free to reach out to Thanin Kongkiatsophon:

Email: bewxtt@gmail.com

## Credits

### Frontend & Design
- **Emily Li**  
- **Saidah Ly**  
- **Jolin Huang**
- **Thanin Kongkiatsophon**  

### Backend
- **David Yu**  
- **Thanin Kongkiatsophon**  
