# ClassifyApp

ClassifyApp allows you to effortlessly classify your Spotify playlists into different genres using the power of AI. This application provides an easy way for users to break down their music collection into more personalized and organized playlists.

## Features
- **Spotify Integration**: Log in using your Spotify credentials to access your playlists.
- **AI-Based Categorization**: Leverage AI to categorize songs based on genres, energy levels, and more.
- **Interactive User Interface**: Select playlists, view song details, and manage playlists all from a convenient web interface.
- **User-Friendly UI**: Built with React for a modern and responsive experience.

## Tech Stack
- **Frontend**: React.js, Bootstrap, Axios
- **Backend**: Node.js, Express.js
- **AI/ML**: Clustering in scikit-learn and Natural Language Processing (NLP) using GPT-3
- **Database**: Not required at this stage
- **Authentication**: Spotify OAuth 2.0
- **Deployment**: Heroku (for both frontend and backend)
- **Version Control**: Git/GitHub

## Getting Started

### Prerequisites
To run this project locally, ensure you have the following installed:
- Node.js and npm
- Spotify Developer Account (for API credentials)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/thaninbew/classify.git
   cd classify
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd frontend/
   npm install
   cd ../../backend
   npm install
   ```

3. Create a `.env` file in the backend and frontend folder with your Spotify API credentials:
   ```
   CLIENT_ID=your_client_id_here
   CLIENT_SECRET=your_client_secret_here
```
   frontend: 
```
   REDIRECT_URI=http://localhost:3001/callback
   ```

### Running the Application
To start both the frontend and backend simultaneously, run the following command from the root directory:
```bash
npm start
```
- The backend server runs on [http://localhost:3001](http://localhost:3001).
- The frontend runs on [http://localhost:3000](http://localhost:3000).

### Available Scripts
In the project directory, you can also run:

- **Frontend**:
  - `npm start`: Starts the React development server.
  - `npm run build`: Builds the app for production.

- **Backend**:
  - `npm run server`: Starts the backend server with Nodemon for hot-reloading.

## Project Structure
```
classifyapp/
├── frontend/
│   ├── frontend/ (React code)
│   └── package.json
├── backend/
│   ├── index.js (Express code)
│   └── package.json
└── README.md
```

## Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
If you have any questions or suggestions, feel free to reach out at [bewxtt@gmail.com].
