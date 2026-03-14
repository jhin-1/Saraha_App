# Saraha App

A modern anonymous messaging platform built with Node.js, Express, and MongoDB. Inspired by the Arabic tradition of sending anonymous messages to friends, Saraha allows users to create profiles, share anonymous messages, and connect without revealing identities.

## 🚀 Features

- **Anonymous Messaging**: Send messages without revealing your identity
- **User Authentication**: Secure login with JWT tokens and Google OAuth
- **Profile Management**: Create and customize user profiles with shareable links
- **Email Verification**: OTP-based email verification for account security
- **Password Security**: Bcrypt hashing with account lockout after failed attempts
- **File Uploads**: Support for profile images and message attachments
- **Real-time Notifications**: Email notifications for important events
- **Caching**: Redis integration for performance optimization
- **Role-based Access**: Admin and user roles with different permissions

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT, Google OAuth
- **Validation**: Joi
- **File Handling**: Multer
- **Email Service**: Nodemailer
- **Security**: bcrypt, CORS

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/saraha-app.git
   cd saraha-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=
   MONGODB_URI
   REDIS_URL
   JWT_SECRET
   JWT_REFRESH_SECRET
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   EMAIL_USER
   EMAIL_PASS
   BASE_URL
   ```

4. **Start MongoDB and Redis**
   Make sure MongoDB and Redis are running on your system.

5. **Run the application**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm start
   ```

## 📖 Usage

### API Endpoints

#### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/get-user` - Get current user info
- `POST /api/v1/auth/signup/gmail` - Google OAuth signup

#### Messages
- `POST /api/v1/message/sendmessage/:userId` - Send anonymous message
- `GET /api/v1/message/getmessages` - Get all messages for user
- `DELETE /api/v1/message/deletemessage/:messageId` - Delete message

#### User Profiles
- `GET /api/v1/users/get-user-profile` - Get user profile
- `PATCH /api/v1/users/update-profile` - Update profile
- `DELETE /api/v1/users/delete-profile` - Delete account

### Example Usage

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:0000/api/v1/auth/signup \
     -F "firstName=John" \
     -F "lastName=Doe" \
     -F "email=john@example.com" \
     -F "password=securepassword" \
     -F "image=@profile.jpg"
   ```

2. **Send an anonymous message:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/message/sendmessage/USER_ID \
     -F "message=Hello, anonymous friend!" \
     -F "image=@message.jpg"
   ```

## 🏗️ Project Structure

```
saraha-app/
├── config/                 # Configuration files
├── src/
│   ├── database/           # Database connections and models
│   ├── modules/            # Feature modules (auth, messages, users)
│   ├── common/             # Shared utilities and middleware
│   └── main.js             # Application entry point
├── upload/                 # Static file uploads
├── package.json
└── README.md
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Account lockout after 5 failed login attempts
- Token revocation on logout
- Input validation with Joi
- CORS protection
- Rate limiting (configurable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👤 Author

**Ahmed Yosri**
- GitHub: [@jhin-1](https://github.com/jhin-1)
- Email: ahmedyosri52@gmail.com

## 🙏 Acknowledgments

- Inspired by the traditional Saraha messaging concept
- Built with modern Node.js best practices
- Thanks to the open-source community for the amazing tools and libraries</content>
<parameter name="filePath">d:\Project_course\saraha_app\README.md