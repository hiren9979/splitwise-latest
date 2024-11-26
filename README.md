# Expense Sharing Application

A full-stack expense sharing application built with Angular (Frontend) and Node.js/Express (Backend). This project helps users track and split expenses among friends, family, or roommates, similar to Splitwise. The application simplifies group expense management and makes it easy to settle debts between users.

## Features

- **User Management**
  - User registration and authentication

- **Group Management**
  - Create and manage expense groups
  - Group activity timeline

- **Expense Management**
  - Add, edit, and delete expenses
  - Split expenses equally or custom amounts
  - Expense categories and tags
  - Add expense notes and comments

- **Balance & Settlements**
  - Real-time balance calculations
  - Simplified debt optimization
  - Settlement suggestions

- **Dashboard & Analytics**
  - Personal expense dashboard
  - Monthly spending analysis
  - Category-wise expense breakdown
  - Group expense statistics

## Tech Stack

### Frontend
- Angular 15+
- Angular Material UI
- NgRx for state management
- Chart.js for analytics
- Angular Forms
- TypeScript

### Backend
- Node.js
- Express.js
- MySQL Database
- Sequelize ORM
- JWT Authentication
- Nodemailer for emails
- Multer for file uploads

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)
- MySQL (v8.0 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=splitwise_db
   JWT_SECRET=your_jwt_secret
   ```

4. Set up the database:
   ```bash
   npm run db:migrate
   ```

5. Start the backend server:
   ```bash
   npm run start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the environment files in `src/environments` with your backend API URL

4. Start the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## Project Structure

```
splitwise/
├── frontend/                # Angular frontend application
│   ├── src/
│   │   ├── app/            # Components, services, and modules
│   │   ├── assets/         # Static assets
│   │   └── environments/   # Environment configurations
│   └── package.json
│
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── package.json
│
└── README.md
```

## API Documentation

The backend API includes the following main endpoints:

- **Auth Routes**
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/forgot-password

- **User Routes**
  - GET /api/users/profile
  - PUT /api/users/profile
  - GET /api/users/friends

- **Group Routes**
  - POST /api/groups
  - GET /api/groups
  - PUT /api/groups/:id
  - DELETE /api/groups/:id

- **Expense Routes**
  - POST /api/expenses
  - GET /api/expenses
  - PUT /api/expenses/:id
  - DELETE /api/expenses/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Splitwise
- Built with modern web technologies
- Focused on user experience and simplicity