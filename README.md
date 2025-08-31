# Interview Prep AI - Enhanced Learning Platform

A comprehensive AI-powered interview preparation platform with dynamic quiz generation, user-specific progress tracking, and secure JWT authentication.

## 🚀 Features

### ✅ Authentication & Security
- **JWT Authentication**: Secure login/signup with JWT tokens
- **Protected Routes**: All sensitive endpoints require authentication
- **Password Hashing**: Secure password storage with bcrypt
- **User Profiles**: Complete user profile management with profile images

### 🧠 Dynamic Quiz Generation
- **AI-Powered Questions**: Generate interview questions using Google Gemini AI
- **Role-Specific Content**: Tailored questions based on job role and experience level
- **Topic Focus**: Customize questions by specific topics or skills
- **Multiple Question Types**: Support for various question formats and difficulty levels

### 📊 User-Specific Progress Tracking
- **Real-time Analytics**: Track performance with detailed analytics dashboard
- **Session Progress**: Monitor progress within individual study sessions
- **Performance Metrics**: 
  - Question accuracy tracking
  - Time spent per question
  - Confidence level assessment
  - Learning streak tracking
- **Category Performance**: Breakdown by topic/category
- **Daily Progress**: Visual progress tracking over time

### 🎯 Quiz Interface
- **Interactive Quiz Mode**: Answer questions and get immediate feedback
- **Study Mode**: Traditional Q&A review mode
- **Progress Tracking**: Real-time progress updates during quizzes
- **Confidence Assessment**: Rate your confidence in answers
- **Timer Tracking**: Monitor time spent on each question

### 📈 Analytics Dashboard
- **Overview Tab**: Key performance indicators and statistics
- **Performance Analysis**: Detailed breakdown of learning performance
- **Learning Trends**: Track improvement over time
- **Activity Calendar**: Daily activity and study patterns
- **Achievements System**: Badges and milestones (coming soon)

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Gemini AI** for question generation
- **bcrypt** for password hashing
- **Multer** for file uploads

### Frontend
- **React.js** with Vite
- **React Router** for navigation
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications

## 📁 Project Structure

```
MYAiIQ/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── sessionController.js
│   │   └── progressController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Question.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── questionRoutes.js
│   │   └── progressRoutes.js
│   ├── utils/
│   │   └── prompts.js
│   └── server.js
└── frontend/
    └── interview-prep-ai/
        ├── src/
        │   ├── components/
        │   │   ├── Cards/
        │   │   ├── Inputs/
        │   │   ├── Loader/
        │   │   ├── layouts/
        │   │   └── ProgressAnalytics.jsx
        │   ├── pages/
        │   │   ├── Auth/
        │   │   ├── Home/
        │   │   ├── InterviewPrep/
        │   │   │   └── components/
        │   │   │       └── QuizInterface.jsx
        │   │   └── Analytics/
        │   │       └── AnalyticsDashboard.jsx
        │   ├── context/
        │   │   └── userContext.jsx
        │   └── utils/
        │       ├── apiPaths.js
        │       └── axiosInstance.js
        └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Google Gemini AI API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/interview-prep-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API base URL in `src/utils/apiPaths.js`:
   ```javascript
   export const BASE_URL = "http://localhost:5000";
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/upload-image` - Upload profile image

### Sessions
- `POST /api/sessions/create` - Create new session
- `GET /api/sessions/my-sessions` - Get user sessions
- `GET /api/sessions/:id` - Get session details
- `DELETE /api/sessions/:id` - Delete session

### Questions
- `POST /api/questions/add` - Add questions to session
- `POST /api/questions/:id/pin` - Pin/unpin question
- `PUT /api/questions/:id/note` - Update question note

### Progress Tracking
- `POST /api/progress/submit-answer` - Submit quiz answer
- `GET /api/progress/analytics` - Get user analytics
- `GET /api/progress/session/:id` - Get session progress
- `PUT /api/progress/experience-level` - Update experience level

### AI Integration
- `POST /api/ai/generate-questions` - Generate interview questions
- `POST /api/ai/generate-explanation` - Generate concept explanations

## 🎯 Usage

### Creating a Study Session
1. Log in to your account
2. Click "Add New" on the dashboard
3. Fill in the role, experience level, and topics
4. AI will generate relevant questions
5. Start studying in either Study Mode or Quiz Mode

### Taking Quizzes
1. Navigate to a session
2. Switch to "Quiz Mode"
3. Answer questions and rate your confidence
4. Get immediate feedback and track progress
5. Review your performance in the Analytics dashboard

### Tracking Progress
1. Visit the Analytics dashboard
2. View overall performance metrics
3. Analyze category-specific performance
4. Track daily progress and learning streaks
5. Monitor time spent and accuracy improvements

## 🔒 Security Features

- **JWT Token Authentication**: Secure session management
- **Password Hashing**: Bcrypt encryption for passwords
- **Protected Routes**: All sensitive endpoints require authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🚧 Future Enhancements

- [ ] Advanced AI answer evaluation
- [ ] Spaced repetition algorithm
- [ ] Collaborative study groups
- [ ] Mobile app development
- [ ] Advanced analytics and insights
- [ ] Gamification features
- [ ] Integration with job boards
- [ ] Video interview practice

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team. # Updated on day 1
# Updated on day 2
# Updated on day 3
# Updated on day 4
# Updated on day 5
# Updated on day 6
# Updated on day 7
# Updated on day 8
# Updated on day 9
# Updated on day 10
# Updated on day 11
# Updated on day 12
# Updated on day 13
# Updated on day 14
# Updated on day 15
# Updated on day 16
