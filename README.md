# React CRUD Application with Firebase

A full-stack CRUD (Create, Read, Update, Delete) application built with React and Firebase.

## Features

- User Authentication (Sign Up, Login, Logout)
- CRUD Operations for Items
- Real-time Database Updates
- Modern UI with Material-UI
- Responsive Design

## Technologies Used

- React.js
- Firebase (Authentication & Firestore)
- Material-UI
- React Router
- Web Vitals

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <your-project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

1. Sign up for a new account
2. Log in with your credentials
3. Create, read, update, and delete items in the dashboard
4. Log out when done

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # Firebase and other services
  ├── context/       # React context providers
  ├── utils/         # Utility functions
  └── App.js         # Main application component
``` 