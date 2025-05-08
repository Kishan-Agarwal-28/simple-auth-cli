# Simple Auth CLI
![npm version](https://img.shields.io/npm/v/simple-auth-cli)
![license](https://img.shields.io/npm/l/simple-auth-cli)
![downloads](https://img.shields.io/npm/dm/simple-auth-cli)
![GitHub stars](https://img.shields.io/github/stars/Kishan-Agarwal-28/simple-auth-cli?style=social)
![GitHub forks](https://img.shields.io/github/forks/Kishan-Agarwal-28/simple-auth-cli?style=social)
![GitHub issues](https://img.shields.io/github/issues/Kishan-Agarwal-28/simple-auth-cli)
![visitors](https://visitor-badge.glitch.me/badge?page_id=Kishan-Agarwal-28/simple-auth-cli)
![Beta](https://img.shields.io/badge/status-Beta-yellow)

A robust authentication system implementation supporting multiple providers that can be integrated into your Node.js application with a single command.
## Features

### Authentication Methods
- **Traditional Authentication**
  - Email/Password registration and login
  - Password reset functionality
  - Email verification system
  
- **OAuth2.0 Providers**
  - Google
  - GitHub
  - Spotify
  - (Prepared for Facebook and Microsoft integration)

- **Two-Factor Authentication (2FA)**
  - WebAuthn support
  - Biometric authentication
  - Hardware security key support

### Additional Security Features
- JWT-based authentication
- Refresh token rotation
- Session management
- Rate limiting
- CSRF protection
- Secure cookie handling

### User Management
- Profile management
- Avatar upload and management
- Email change verification
- Username management
- Password recovery
- Account verification

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Environment variables (see Configuration section)

## Installation

```bash
npx simple-auth-cli
```

## Quick Start

1. Initialize the authentication system:
```bash
npx simple-auth-cli
```

2. Set up your environment variables in `.env`:
```env
# Database
MONGODB_URI=your_mongodb_uri

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_TOKEN_HOST=https://oauth2.googleapis.com

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_TOKEN_HOST=https://github.com

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_TOKEN_HOST=https://accounts.spotify.com

# Similarly add for other providers

# Cloudinary (for avatar storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
RESEND_API_KEY=your_resend_api_key

# Application
APPNAME=your_app_name
APPURL=your_app_url
```

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/generateNewTokens` - Refresh access token

### OAuth
- `GET /api/v1/users/oauth` - Initialize OAuth flow
- `GET /api/v1/users/auth/oauth/:provider/callback` - OAuth callback URLs

### Account Management
- `POST /api/v1/users/verify` - Verify email
- `POST /api/v1/users/forgotPassword` - Request password reset
- `POST /api/v1/users/changePassword` - Change password
- `POST /api/v1/users/changeEmail` - Change email
- `POST /api/v1/users/changeUserName` - Change username
- `PATCH /api/v1/users/updateAvatar` - Update profile picture

### Two-Factor Authentication
- `POST /api/v1/users/initialize2FA` - Setup 2FA
- `POST /api/v1/users/verify2FA` - Verify 2FA
- `POST /api/v1/users/verify2FALogin` - Login with 2FA

## Security Considerations

- All passwords are hashed using bcrypt
- JWTs are stored in HTTP-only cookies
- File upload validation
- Email verification required for critical actions

## Error Handling

The system implements a centralized error handling mechanism with detailed error messages and appropriate HTTP status codes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 

## License

This project is licensed under the MIT License.

