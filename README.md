# 🎓 School Payment Dashboard

A comprehensive full-stack school payment management system built with React.js (Frontend) and NestJS (Backend), featuring real-time transaction tracking, multi-gateway payment processing, and advanced analytics.

## 🌟 Features

### Frontend Dashboard
- **📊 Real-time Analytics** - Live payment volume visualization with Chart.js
- **🔍 Advanced Filtering** - Multi-select filters for status, school ID, and date ranges
- **📄 Pagination & Search** - Searchable and paginated transaction tables
- **🌙 Dark Mode** - Complete light/dark theme toggle with localStorage persistence
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **🎯 URL Persistence** - Filters and search parameters saved in URL for sharing

### Backend API
- **💳 Payment Processing** - Integrated with Cashfree payment gateway
- **🔐 JWT Authentication** - Secure user authentication system
- **📈 Transaction Management** - Advanced aggregation pipelines with MongoDB
- **⚡ Real-time Updates** - Webhook handling for payment status updates
- **🎯 RESTful APIs** - Complete CRUD operations for all entities
- **📊 Analytics** - Transaction statistics and reporting endpoints

### Key Pages
1. **Transactions Overview** - Paginated list with advanced filtering and sorting
2. **School Transactions** - Dedicated school-specific transaction views
3. **Transaction Status Check** - Real-time status lookup by custom order ID
4. **Payment Processing** - Secure payment creation and management

## 🚀 Live Demo

- **Frontend**: [https://school-payment-dashboard.netlify.app](https://your-frontend-url)
- **Backend API**: [https://school-payment-api.herokuapp.com](https://your-backend-url)

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI Framework
- **Tailwind CSS** - Styling and responsive design
- **Chart.js** - Real-time data visualization
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Context API** - State management for auth and theme

### Backend
- **NestJS** - Node.js framework with TypeScript
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Cashfree SDK** - Payment gateway integration
- **Class Validator** - Request validation and sanitization
- **Swagger** - API documentation

## 📋 Prerequisites

- **Node.js** 18+ and npm 9+
- **MongoDB** database (local or cloud)
- **Cashfree** payment gateway account
- **Git** for version control

## ⚙️ Installation & Setup

### 1. Clone the Repository
git clone https://github.com/yourusername/school-payment-dashboard.git
cd school-payment-dashboard

text

### 2. Backend Setup
cd backend
npm install

Create environment file
cp .env.example .env

Configure your environment variables (see below)
Start development server
npm run start:dev

text

### 3. Frontend Setup
cd frontend
npm install

Create environment file
echo "REACT_APP_API_URL=http://localhost:3000" > .env

Start development server
npm start

text

## 🌍 Environment Variables

### Backend (.env)
Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-payments

JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

Cashfree Payment Gateway
PG_KEY=your-cashfree-pg-secret-key
API_KEY=your-cashfree-api-key
CASHFREE_API_URL=https://dev-vanilla.edviron.com/erp

Application Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

Test Configuration
SCHOOL_ID=your-test-school-id

text

### Frontend (.env)
API Configuration
REACT_APP_API_URL=http://localhost:3000

Optional: Analytics
REACT_APP_GA_TRACKING_ID=your-google-analytics-id

text

## 📖 API Documentation

### Authentication Endpoints

#### Register User
POST /auth/register
Content-Type: application/json

{
"username": "admin",
"email": "admin@school.com",
"password": "securepassword123"
}

text

**Response:**
{
"success": true,
"message": "User registered successfully",
"user": {
"id": "64f8a1b2c3d4e5f6g7h8i9j0",
"username": "admin",
"email": "admin@school.com"
}
}

text

#### Login User
POST /auth/login
Content-Type: application/json

{
"username": "admin",
"password": "securepassword123"
}

text

**Response:**
{
"success": true,
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "64f8a1b2c3d4e5f6g7h8i9j0",
"username": "admin",
"email": "admin@school.com"
}
}

text

### Payment Endpoints

#### Create Payment
POST /payment/create-payment
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
"school_id": "65b0e6293e9f76a9694d84b4",
"amount": "5000",
"trustee_id": "60d5ec49f8d2e8b5f8c8c8c8",
"student_info": {
"name": "John Doe",
"id": "STU001",
"email": "john@example.com"
}
}

text

**Response:**
{
"success": true,
"order_id": "64f8a1b2c3d4e5f6g7h8i9j0",
"collect_request_id": "CF_REQ_123456789",
"payment_url": "https://payments.cashfree.com/forms/...",
"sign": "generated-signature"
}

text

#### Check Payment Status
GET /payment/status/{collect_request_id}?school_id={school_id}
Authorization: Bearer {jwt_token}

text

**Response:**
{
"success": true,
"status": "completed",
"amount": 5000,
"details": {
"transaction_id": "TXN_789012345",
"payment_time": "2025-09-13T11:40:00Z",
"gateway_response": "Payment successful"
}
}

text

### Transaction Endpoints

#### Get All Transactions
GET /transactions?page=1&limit=10&status=completed&school_id=SCH001&sort=createdAt&order=desc
Authorization: Bearer {jwt_token}

text

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (completed, pending, failed)
- `school_id` (optional): Filter by school ID
- `sort` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order (asc, desc, default: desc)
- `search` (optional): Search in collect_id, school_id, custom_order_id
- `date_from` (optional): Start date filter (YYYY-MM-DD)
- `date_to` (optional): End date filter (YYYY-MM-DD)

**Response:**
{
"success": true,
"message": "Transactions retrieved successfully",
"data": [
{
"collect_id": "COL_123456789",
"school_id": "SCH001",
"gateway": "cashfree",
"order_amount": 5000,
"transaction_amount": 5000,
"status": "completed",
"custom_order_id": "ORD_001_123456",
"student_info": {
"name": "John Doe",
"id": "STU001",
"email": "john@example.com"
},
"payment_time": "2025-09-13T11:40:00Z",
"created_at": "2025-09-13T11:30:00Z"
}
],
"pagination": {
"total": 150,
"pages": 15,
"current": 1,
"limit": 10
}
}

text

#### Get School Transactions
GET /transactions/school/{school_id}?page=1&limit=10
Authorization: Bearer {jwt_token}

text

#### Check Transaction Status
GET /transaction-status/{custom_order_id}
Authorization: Bearer {jwt_token}

text

### Webhook Endpoints

#### Payment Webhook
POST /payment/webhook
Content-Type: application/json

{
"order_info": {
"order_id": "COL_123456789",
"status": "completed",
"amount": 5000,
"transaction_id": "TXN_789012345",
"payment_method": "UPI",
"status_message": "Payment successful"
},
"signature": "webhook-signature",
"timestamp": "2025-09-13T11:40:00Z"
}

text

## 🗂️ Project Structure

school-payment-dashboard/
├── backend/ # NestJS Backend
│ ├── src/
│ │ ├── auth/ # Authentication module
│ │ ├── payment/ # Payment processing module
│ │ ├── transactions/ # Transaction management
│ │ ├── schemas/ # MongoDB schemas
│ │ ├── context/ # Application contexts
│ │ └── main.ts # Application entry point
│ ├── .env.example # Environment variables template
│ └── package.json
├── frontend/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── auth/ # Authentication components
│ │ │ ├── dashboard/ # Dashboard components
│ │ │ ├── transactions/ # Transaction components
│ │ │ ├── pages/ # Page components
│ │ │ └── common/ # Shared components
│ │ ├── context/ # React contexts
│ │ ├── services/ # API services
│ │ └── App.js # Main application component
│ ├── public/
│ ├── .env # Environment variables
│ └── package.json
├── docs/ # Additional documentation
├── .gitignore
├── README.md
└── package.json # Root package.json

text

## 🧪 Testing

### Backend Testing
cd backend
npm test # Run unit tests
npm run test:e2e # Run end-to-end tests
npm run test:cov # Run tests with coverage

text

### Frontend Testing
cd frontend
npm test # Run Jest tests
npm run test:coverage # Run with coverage report

text

### API Testing with Postman

Import the provided Postman collection (`postman-collection.json`) to test all API endpoints:

1. Set environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `jwt_token`: Your JWT token from login

2. Test authentication flow:
   - Register → Login → Access protected routes

## 🚀 Deployment

### Frontend Deployment (Netlify)

1. **Build the application:**
cd frontend
npm run build

text

2. **Deploy to Netlify:**
- Connect GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `build`
- Add environment variables in Netlify dashboard

### Backend Deployment (AWS/Heroku)

1. **Prepare for deployment:**
cd backend
echo "web: npm run start:prod" > Procfile

text

2. **Environment setup:**
- Configure production MongoDB URI
- Set all required environment variables
- Update CORS settings for production frontend URL

3. **Deploy:**
For Heroku
heroku create school-payment-api
git push heroku main

For AWS
Use AWS CLI or AWS Console to deploy
text

## 🔐 Security Features

- **JWT Authentication** with secure token generation
- **Request Validation** using class-validator decorators
- **CORS Configuration** for cross-origin resource sharing
- **Environment Variables** for sensitive configuration
- **Webhook Signature Verification** for payment security
- **Input Sanitization** to prevent injection attacks

## 📊 Performance Features

- **Database Indexing** for optimized queries
- **Pagination** for large datasets
- **Caching** for frequently accessed data
- **Lazy Loading** for optimal bundle size
- **Code Splitting** for faster initial load times

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 3000 is available

2. **Frontend login fails:**
- Verify backend is running on correct port
- Check CORS configuration
- Validate API endpoints in browser network tab

3. **Payment gateway errors:**
- Verify Cashfree API credentials
- Check webhook URL configuration
- Validate JWT signature generation

### Debug Mode
Backend debug mode
cd backend
npm run start:debug

Frontend with detailed errors
cd frontend
REACT_APP_DEBUG=true npm start

text

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@AmanKandare](https://github.com/AmanKandare)
- LinkedIn: [Your LinkedIn](www.linkedin.com/in/aman-kandare)
- Email: kandareaman78@gmail.com

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Scalable Node.js server-side applications
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - The application data platform
- [Cashfree](https://www.cashfree.com/) - Payment gateway solutions

## 📞 Support

For support, kandareaman78@gmail.com

---

⭐ **If you found this project helpful, please give it a star!** ⭐
