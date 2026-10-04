# tripvault
# TripVault

A travel memory journal built using the MERN stack.

TripVault is a web application designed to help users keep track of their travel memories. The current implementation includes user registration, login, JWT-based authentication, protected routes, and a personalized dashboard.

## Features

- **User Registration:** Create an account with secure password hashing.
- **User Login:** Authenticate users and generate JWT tokens.
- **Protected Routes:** Restrict access to authenticated pages.
- **User Dashboard:** Display authenticated user information.
- **JWT Authentication:** Secure backend endpoints using token verification.
- **Logout:** Clear the stored token and return to the login page.
- **Error Handling:** Handle invalid credentials, duplicate registration, and API errors.

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
TripVault/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authLoginController.js
│   │   └── authRegisterController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authLoginRoutes.js
│   │   └── authRegisterRoutes.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/poshamsrija/tripvault.git
cd tripvault
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your own configuration. Keep your actual `.env` file private.

Start the backend in development mode:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 3. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/` | API welcome message | Not required |
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Log in and receive a JWT | Not required |
| GET | `/api/auth/me` | Retrieve authenticated user details | Required |

For the protected `/api/auth/me` endpoint, include the JWT in the request header:

```http
Authorization: Bearer <your_jwt_token>
```

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start the backend using Nodemon |
| `npm start` | Start the backend using Node.js |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |

## Authentication Flow

1. A user registers with their details.
2. The backend hashes the password before storing user information.
3. The user logs in using their credentials.
4. The backend verifies the credentials and returns a JWT.
5. The frontend stores the token and uses it for authenticated API requests.
6. Protected pages require a token to access the dashboard.
7. The backend verifies the token before returning protected user information.
8. Logging out removes the stored token.

## Development Status

The current version focuses on the authentication system and dashboard. Additional travel-journal features can be developed in future iterations.

## Author

**Srija Posham**

GitHub: [poshamsrija](https://github.com/poshamsrija)