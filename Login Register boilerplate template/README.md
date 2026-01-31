# Login & Register Boilerplate Template
<p align="center">
  <img src="/Demo.gif" width="550" alt="PC Demo">

</p>


A full-stack Login register authentication boilerplate built with **Node.js/Express** backend, **Next.js** frontend, and **MongoDB** database. This template provides a solid foundation for projects that require user authentication, registration, and session management.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Password Hashing**: Bcrypt-based password encryption
- **JWT Tokens**: JSON Web Token-based authentication
- **MongoDB Integration**: NoSQL database for user data storage
- **Express API**: RESTful backend with middleware support
- **Next.js Frontend**: Modern React-based frontend with server-side rendering
- **CORS Enabled**: Cross-origin resource sharing support
- **Environment Configuration**: Dotenv for secure environment variables
- **Calendar & Subscription Views**: Pre-built page components for calendar and subscription management
- **Responsive Design**: Tailwind CSS for modern, responsive UI

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 📁 Project Structure

```
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/
│   │   └── User.js               # User schema model
│   └── routes/
│       └── auth.js               # Authentication routes (login, register)
├── frontend/
│   ├── app/
│   │   ├── layout.js             # Root layout component
│   │   ├── page.js               # Homepage
│   │   ├── globals.css           # Global styles
│   │   ├── calendarView/         # Calendar page
│   │   ├── freetrails/           # Free trials page
│   │   ├── home/                 # Home page
│   │   └── subscriptions/        # Subscriptions page
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   └── tsconfig.json             # TypeScript configuration
└── package.json                  # Root package.json
```

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ArunKarthick19/Nameless.git
cd Nameless
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Create .env file in root directory
touch .env

# Add the following to .env:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/login-register
JWT_SECRET=your_secret_key_here
```

### 3. Frontend Setup
```bash
cd frontend

# Install frontend dependencies
npm install

# Create .env.local file (if needed)
touch .env.local
```

## 🏃 Running the Application

### Start Backend Server
```bash
# From root directory
npm run dev

# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
# From frontend directory
cd frontend
npm run lol

# Frontend runs on http://localhost:3000
```

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login user and receive JWT token |

### Request Examples

**Register:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Login:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs
3. User document is stored in MongoDB
4. Upon login, credentials are verified
5. JWT token is issued for authenticated requests
6. Token is used for protected routes via auth middleware

## 🎨 Frontend Pages

- **Home**: Landing page with navigation
- **Calendar View**: Full calendar integration using FullCalendar
- **Free Trials**: Browse and manage free trial offerings
- **Subscriptions**: Manage user subscription plans

## 📦 Key Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **next**: React framework with SSR
- **react**: UI library
- **react-calendar**: Calendar component
- **@fullcalendar/react**: Full calendar integration
- **axios**: HTTP client
- **tailwindcss**: Utility-first CSS framework

## 🔧 Available Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon
```

### Frontend
```bash
npm run lol    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/login-register
JWT_SECRET=your_secret_key_here
```

Create a `.env.local` file in the frontend directory if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend (Node.js)
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Update MongoDB URI to your cloud database

### Frontend (Next.js)
- Deploy to Vercel, Netlify, or your preferred hosting
- Update API endpoint URLs for production

## 📄 License

ISC

## 👨‍💻 Author

Arun Karthick

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements!

## 📞 Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/ArunKarthick19/Nameless/issues).

---

**Happy Coding!** 🎉
