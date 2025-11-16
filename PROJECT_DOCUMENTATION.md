# Complete Project Documentation: StudyApp - AI-Powered Learning Path Platform

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Database Models](#database-models)
8. [API Routes & Endpoints](#api-routes--endpoints)
9. [WebSocket Implementation](#websocket-implementation)
10. [Key Features & Functionality](#key-features--functionality)
11. [Authentication & Security](#authentication--security)
12. [AI Integration](#ai-integration)
13. [Deployment](#deployment)

---

## 🎯 Project Overview

**StudyApp** is a comprehensive AI-powered learning management system that helps students learn new topics by:
- Generating prerequisite concepts using AI (GPT-4o via OpenRouter)
- Creating personalized learning paths based on quiz performance
- Providing interactive quizzes to test prerequisite knowledge
- Offering real-time chat support between students and admins
- Tracking learning progress and quiz scores

### Core Purpose
The application bridges the gap between what students want to learn and what they need to know first, using AI to generate prerequisite concepts and personalized learning paths.

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │◄───────►│    Backend      │◄───────►│   MongoDB       │
│   (React)       │  HTTP   │   (Express)     │  ODM    │   (Database)    │
│   Port: 3000    │         │   Port: 5000    │         │   (Cloud)       │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                            │                            │
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    │
                           ┌────────▼────────┐
                           │  Socket.IO     │
                           │  (WebSocket)  │
                           └────────────────┘
                                    │
                           ┌────────▼────────┐
                           │  OpenRouter    │
                           │  (GPT-4o API)  │
                           └────────────────┘
```

### Architecture Pattern
- **Frontend**: Single Page Application (SPA) with React Router
- **Backend**: RESTful API with Express.js
- **Real-time**: WebSocket connections via Socket.IO
- **Database**: MongoDB with Mongoose ODM
- **AI**: OpenRouter API for GPT-4o integration

---

## 🛠️ Technology Stack

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >=18.0.0 | Runtime environment |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Express.js** | 5.1.0 | Web framework |
| **Mongoose** | 8.15.1 | MongoDB ODM |
| **Socket.IO** | 4.7.2 | WebSocket library |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 3.0.2 | Password hashing |
| **Axios** | 1.9.0 | HTTP client |
| **dotenv** | 16.5.0 | Environment variables |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI library |
| **React Router** | 7.6.2 | Client-side routing |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Vite** | 6.3.5 | Build tool & dev server |
| **Axios** | 1.10.0 | HTTP client |
| **Socket.IO Client** | 4.8.1 | WebSocket client |
| **vis-network** | 9.1.12 | Graph visualization |
| **UUID** | 9.0.1 | Unique ID generation |

### External Services
- **MongoDB Atlas**: Cloud database
- **OpenRouter API**: GPT-4o AI model access
- **Render.com**: Deployment platform (optional)

---

## 📁 Project Structure

```
studyapp/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── middleware/        # Authentication middleware
│   │   │   └── auth.ts
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.ts
│   │   │   ├── Chat.ts
│   │   │   ├── Notification.ts
│   │   │   └── Prereq.ts
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.ts
│   │   │   ├── prerequisites.ts
│   │   │   ├── chat.ts
│   │   │   ├── notifications.ts
│   │   │   ├── learningPath.ts
│   │   │   ├── quixAttempts.ts
│   │   │   └── summaryRoute.ts
│   │   └── services/          # Business logic services
│   │       ├── prereqGenerator.ts
│   │       └── mcqGenerator.ts
│   ├── index.ts               # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                   # Environment variables
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── LearningInterface.tsx
│   │   │   ├── Quiz.tsx
│   │   │   ├── Graph.tsx
│   │   │   ├── ChatSupport.tsx
│   │   │   ├── AuthForms.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   └── ... (more components)
│   │   ├── contexts/         # React contexts
│   │   │   └── WebSocketContext.tsx
│   │   ├── config/           # Configuration
│   │   │   └── api.ts
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🔧 Backend Architecture

### Main Server File: `backend/index.ts`

**Purpose**: Entry point for the backend server

**Key Responsibilities**:
1. **Environment Setup**
   - Loads `.env` file with `dotenv.config()`
   - Configures CORS for allowed origins
   - Sets up Express middleware

2. **Server Initialization**
   - Creates HTTP server
   - Initializes Socket.IO server
   - Configures MongoDB connection

3. **Route Registration**
   ```typescript
   app.use('/api/auth', authRoutes);
   app.use('/api/prerequisites', authenticate, prereqRoutes);
   app.use('/api', summaryRoutes);
   app.use('/api', quizAttempts);
   app.use('/api', learningPath);
   app.use('/api/notifications', notificationRoutes);
   app.use('/api/chat', chatRoutes);
   ```

4. **WebSocket Setup**
   - Authentication middleware for Socket.IO
   - Real-time event handlers for chat

5. **Database Connection**
   - MongoDB connection with retry logic
   - Connection event handlers

### Middleware: `backend/src/middleware/auth.ts`

**Functions**:
- `authenticate(req, res, next)`: Verifies JWT token from Authorization header
- `requireRole(role)`: Checks if user has specific role (admin/student)
- `requireAuth(req, res, next)`: Ensures user is authenticated

**JWT_SECRET**: Exported constant used for token signing/verification

---

## 🗄️ Database Models

### 1. User Model (`backend/src/models/User.ts`)

**Schema Structure**:
```typescript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'student'], default: 'student'),
  avatar: String (optional),
  topics: [String],                    // Array of topics user is learning
  prerequisites: [{                    // Prerequisites for each topic
    topic: String,
    prerequisites: [String]
  }],
  quizScores: [{                      // Quiz performance history
    topic: String,
    score: Number,
    date: Date
  }],
  learningPaths: [{                   // Generated learning paths
    topic: String,
    weeks: Number,
    level: String,
    durationPerDay: String,
    path: [{}],                       // Weekly content
    generatedAt: Date
  }]
}
```

**Key Features**:
- First registered user automatically becomes admin
- Stores user's learning progress
- Tracks quiz scores per topic
- Stores personalized learning paths

### 2. Chat Model (`backend/src/models/Chat.ts`)

**Schema Structure**:
```typescript
{
  studentId: ObjectId (ref: User, required),
  adminId: ObjectId (ref: User, optional),
  subject: String (required),
  status: String (enum: ['open', 'in_progress', 'closed']),
  messages: [{
    sender: String (enum: ['student', 'admin']),
    senderId: ObjectId,
    message: String,
    timestamp: Date,
    isRead: Boolean
  }],
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date
}
```

**Features**:
- Real-time messaging between students and admins
- Tracks chat status
- Auto-updates timestamps

### 3. Notification Model (`backend/src/models/Notification.ts`)

**Schema Structure**:
```typescript
{
  userId: ObjectId (ref: User, required),
  type: String (enum: ['chat_response', 'system', 'quiz_result']),
  title: String (required),
  message: String (required),
  isRead: Boolean (default: false),
  createdAt: Date,
  relatedData: Mixed (optional)  // Stores chatId, quizId, etc.
}
```

**Features**:
- Real-time notifications
- Multiple notification types
- Read/unread status tracking

### 4. Prereq Model (`backend/src/models/Prereq.ts`)

**Schema Structure**:
```typescript
{
  topic: String (required),
  prerequisites: [String] (required)
}
```

**Purpose**: Global cache of prerequisites for topics (separate from user-specific prerequisites)

---

## 🛣️ API Routes & Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user (first user = admin) |
| POST | `/login` | No | Login user, returns JWT token |
| GET | `/profile` | Yes | Get current user profile |
| GET | `/users` | Yes (Admin) | Get all users (admin only) |
| GET | `/check-admin` | No | Check if admin exists |
| GET | `/verify-token` | Yes | Verify token validity |
| PUT | `/users/:id` | Yes | Update user profile |
| DELETE | `/users/:id` | Yes (Admin) | Delete user (admin only) |

**Key Features**:
- Password validation (8+ chars, uppercase, lowercase, number, special char)
- JWT tokens expire in 7 days
- First registered user automatically becomes admin
- Password hashing with bcryptjs (10 rounds)

### Prerequisites Routes (`/api/prerequisites`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Generate prerequisites for a topic |
| POST | `/mcq` | Yes | Generate MCQs from prerequisites |
| POST | `/reset-mcq-cache` | Yes | Reset MCQ cache |

**Flow**:
1. User submits topic (e.g., "Java")
2. Backend calls OpenRouter API (GPT-4o) to generate prerequisites
3. Prerequisites saved to:
   - Global Prereq collection (cache)
   - User's profile (personalized)
4. Returns list of prerequisites (4-7 items)

**AI Prompt**: Expert curriculum designer that returns only essential prerequisite concepts

### Quiz Routes (`/api/quiz-attempts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get quiz attempts for a topic |
| POST | `/` | Yes | Submit quiz attempt and score |

**Features**:
- Limits 3 attempts per day per topic
- Tracks scores and pass/fail status
- 65% passing threshold

### Learning Path Routes (`/api/learning-path`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Generate personalized learning path |

**Input**: Topic, quiz score percentage, number of weeks
**Output**: Week-by-week learning plan with tasks

**AI Features**:
- Adjusts difficulty based on quiz score
- Generates JSON-structured learning path
- Uses GPT-4o-mini for cost efficiency

### Chat Routes (`/api/chat`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get all chats for user |
| POST | `/` | Yes | Create new chat |
| GET | `/:chatId/messages` | Yes | Get messages for a chat |
| PUT | `/:chatId/close` | Yes | Close a chat |

**Features**:
- Students can create chats
- Admins can respond
- Real-time updates via WebSocket

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get all notifications |
| GET | `/unread-count` | Yes | Get unread count |
| PUT | `/:id/read` | Yes | Mark notification as read |
| PUT | `/read-all` | Yes | Mark all as read |

### Topic Summary Route (`/api/topic-summary`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Get AI-generated summary of a concept |

**Purpose**: Explains prerequisite concepts to help students understand them

---

## 🔌 WebSocket Implementation

### Backend WebSocket (`backend/index.ts`)

**Authentication**:
```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify JWT token
  // Attach user data to socket
})
```

**Events**:
- `connection`: User connects, joins user room and admin room (if admin)
- `send_message`: Send chat message, notify recipient
- `new_chat`: Create new chat, notify admins
- `disconnect`: Handle user disconnection

**Rooms**:
- `user_{userId}`: User-specific room
- `admin_room`: All admins room

### Frontend WebSocket (`frontend/src/contexts/WebSocketContext.tsx`)

**Context Provider**: Manages Socket.IO connection

**Features**:
- Auto-reconnection with exponential backoff
- Connection status tracking
- Token-based authentication
- Max 5 reconnection attempts

**Hook**: `useWebSocket()` - Provides connection status and methods

---

## 🎨 Frontend Architecture

### Main App Component (`frontend/src/App.tsx`)

**Structure**:
```typescript
<WebSocketProvider>
  <AuthWrapper>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/learn" element={<LearningInterface />} />
    </Routes>
  </AuthWrapper>
</WebSocketProvider>
```

**AuthWrapper**:
- Checks localStorage for token
- Sets axios default headers
- Connects WebSocket on login
- Redirects based on user role

### Key Components

#### 1. **LandingPage** (`components/LandingPage.tsx`)
- Public landing page
- Hero section, features, testimonials
- Call-to-action for registration

#### 2. **AdminDashboard** (`components/AdminDashboard.tsx`)
- Student management
- Chat support interface
- View all students and their progress
- Respond to student chats

#### 3. **StudentDashboard** (`components/StudentDashboard.tsx`)
- My Courses: View learning history
- Courses: Browse available topics
- Generate prerequisites
- Take quizzes
- View learning paths
- Chat support

#### 4. **LearningInterface** (`components/LearningInterface.tsx`)
- Enter topic to learn
- View prerequisites with graph visualization
- Click prerequisites to see summaries
- Take prerequisite quiz
- Generate learning path after quiz

#### 5. **Quiz** (`components/Quiz.tsx`)
- Interactive MCQ quiz
- 15 questions (fixed)
- Real-time score calculation
- Pass/fail at 65% threshold
- Generate learning path on pass

#### 6. **Graph** (`components/Graph.tsx`)
- Visualizes prerequisite relationships
- Uses vis-network library
- Interactive node graph

#### 7. **ChatSupport** (`components/ChatSupport.tsx`)
- Real-time chat interface
- Student can create chats
- Admin can respond
- WebSocket-based messaging

### API Configuration (`frontend/src/config/api.ts`)

**Environment Detection**:
- Development: `http://localhost:5000`
- Production: `https://ssmp-backend.onrender.com`

**Centralized Endpoints**: All API endpoints defined in one place

---

## 🤖 AI Integration

### Prerequisites Generation (`backend/src/services/prereqGenerator.ts`)

**Service**: `generatePrerequisites(topic: string)`

**Process**:
1. Validates API key
2. Calls OpenRouter API with GPT-4o
3. Uses specialized prompt for curriculum design
4. Parses response (handles various formats)
5. Returns 4-7 prerequisite concepts

**Prompt Engineering**:
- Expert computer science curriculum designer persona
- Strict rules to avoid topic itself and subtopics
- Focus on foundational concepts only
- Output format: numbered list

**Error Handling**:
- API key validation
- Rate limiting (429)
- Payment required (402)
- Timeout handling
- Response parsing fallbacks

### MCQ Generation (`backend/src/services/mcqGenerator.ts`)

**Service**: `generateMCQs(prerequisites: string[], count: number, reset: boolean, courseName?: string)`

**Process**:
1. Uses GPT-4o via OpenRouter
2. Generates 15 MCQs (fixed count)
3. Caches questions to avoid regeneration
4. Returns structured MCQ objects

**MCQ Structure**:
```typescript
{
  id: string,
  topic: string,
  question: string,
  options: string[],
  answer: string
}
```

### Learning Path Generation (`backend/src/routes/learningPath.ts`)

**Service**: Generates personalized week-by-week learning plan

**Input**:
- Topic
- Quiz score percentage
- Number of weeks (1-52)

**AI Logic**:
- Low score (0-50%): Emphasizes basics
- Medium (51-75%): Balances basics and intermediate
- High (76-100%): Includes advanced topics

**Output**: JSON array of weekly tasks

### Topic Summary (`backend/src/routes/summaryRoute.ts`)

**Service**: Explains prerequisite concepts

**Purpose**: Helps students understand prerequisite concepts before learning main topic

---

## 🔐 Authentication & Security

### JWT Authentication

**Token Structure**:
```typescript
{
  id: string,      // User ID
  role: string,    // 'admin' or 'student'
  exp: number      // Expiration timestamp
}
```

**Token Lifecycle**:
- Generated on login
- Expires in 7 days
- Stored in localStorage (frontend)
- Sent in Authorization header: `Bearer <token>`

### Password Security

**Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Hashing**: bcryptjs with 10 salt rounds

### CORS Configuration

**Allowed Origins**:
- `http://localhost:3000` (Vite dev)
- `http://localhost:5173` (Vite default)
- `https://ssmp.onrender.com` (Production)

**Headers**: Content-Type, Authorization

### WebSocket Security

- Token-based authentication
- JWT verification on connection
- User data attached to socket
- Room-based access control

---

## 🚀 Deployment

### Environment Variables

**Backend (.env)**:
```
OPENROUTER_API_KEY=sk-or-v1-...
JWT_SECRET=your-secret-key
MONGO_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
```

### Build Process

**Backend**:
```bash
npm run build    # Compile TypeScript
npm start        # Run production server
```

**Frontend**:
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Deployment Platforms

- **Backend**: Render.com (or any Node.js hosting)
- **Frontend**: Vercel, Netlify, or static hosting
- **Database**: MongoDB Atlas (cloud)

---

## 📊 Key Features & Functionality

### 1. **Prerequisites Generation**
- AI-powered prerequisite identification
- Saves to user profile
- Visual graph representation
- Clickable concepts with summaries

### 2. **Interactive Quizzes**
- 15 MCQs per quiz
- 3 attempts per day per topic
- 65% passing threshold
- Score tracking

### 3. **Personalized Learning Paths**
- Generated based on quiz performance
- Adjustable duration (1-52 weeks)
- Week-by-week task breakdown
- Difficulty-adjusted content

### 4. **Real-time Chat Support**
- Student-admin communication
- WebSocket-based messaging
- Notification system
- Chat status tracking

### 5. **Progress Tracking**
- Quiz scores per topic
- Learning path completion
- Prerequisites mastered
- User dashboard analytics

### 6. **Admin Features**
- Student management
- View all students
- Chat support interface
- User deletion

---

## 🔄 Data Flow Examples

### Prerequisites Generation Flow
```
User Input (Topic: "Java")
    ↓
Frontend: POST /api/prerequisites
    ↓
Backend: authenticate middleware
    ↓
Backend: generatePrerequisites service
    ↓
OpenRouter API (GPT-4o)
    ↓
Parse response → ["Object-Oriented Programming", "Data Structures", ...]
    ↓
Save to: Prereq collection + User profile
    ↓
Return to frontend
    ↓
Display in UI with Graph visualization
```

### Quiz Flow
```
User clicks "Take Quiz"
    ↓
Frontend: POST /api/prerequisites/mcq
    ↓
Backend: generateMCQs service
    ↓
OpenRouter API (GPT-4o)
    ↓
Return 15 MCQs
    ↓
User answers questions
    ↓
Calculate score
    ↓
POST /api/quiz-attempts (save score)
    ↓
If score >= 65%: Generate learning path
    ↓
Display learning path
```

### Chat Flow
```
Student creates chat
    ↓
WebSocket: 'new_chat' event
    ↓
Backend: Save to database
    ↓
Emit to 'admin_room'
    ↓
Admin receives notification
    ↓
Admin responds
    ↓
WebSocket: 'send_message' event
    ↓
Backend: Save message
    ↓
Emit to student's room
    ↓
Student receives message
```

---

## 🎯 Project Goals & Use Cases

### Primary Use Case
A student wants to learn "Machine Learning" but doesn't know where to start. The app:
1. Generates prerequisites (Linear Algebra, Statistics, Python, etc.)
2. Tests knowledge with quiz
3. Generates personalized learning path based on performance
4. Provides week-by-week guidance

### Secondary Use Cases
- **Admin Support**: Help students via real-time chat
- **Progress Tracking**: Monitor learning journey
- **Knowledge Assessment**: Test prerequisite understanding

---

## 📝 Development Workflow

### Running Locally

**Backend**:
```bash
cd backend
npm install
npm run dev  # Runs both backend and frontend
```

**Frontend Only**:
```bash
cd frontend
npm install
npm run dev
```

### Code Structure Principles
- **Separation of Concerns**: Routes, Services, Models
- **Type Safety**: TypeScript throughout
- **Error Handling**: Try-catch blocks with specific errors
- **Environment Configuration**: Centralized API config

---

## 🔧 Configuration Files

### `backend/tsconfig.json`
- TypeScript compiler configuration
- Target: ES2020
- Module: CommonJS

### `frontend/vite.config.ts`
- Vite build configuration
- React plugin
- Development server settings

### `backend/package.json`
- Dependencies and scripts
- Concurrently runs backend + frontend
- TypeScript compilation

---

## 📈 Future Enhancements (Potential)

1. **Social Features**: Study groups, peer learning
2. **Gamification**: Badges, achievements, leaderboards
3. **Video Integration**: Embed learning videos
4. **Progress Analytics**: Detailed learning analytics
5. **Mobile App**: React Native version
6. **Offline Support**: Service workers for offline access
7. **Multi-language**: Support for multiple languages
8. **Advanced AI**: Fine-tuned models for better recommendations

---

## 🐛 Known Issues & Limitations

1. **API Credits**: OpenRouter free tier has token limits
2. **Quiz Attempts**: Limited to 3 per day per topic
3. **Learning Paths**: Generated once per quiz pass
4. **Chat**: No file attachments yet
5. **Notifications**: No push notifications (browser only)

---

## 📚 Additional Resources

- **MongoDB Atlas**: Cloud database hosting
- **OpenRouter**: AI model access
- **Render.com**: Deployment platform
- **React Documentation**: https://react.dev
- **Express Documentation**: https://expressjs.com
- **Socket.IO Documentation**: https://socket.io/docs

---

## 🎓 Conclusion

This is a comprehensive learning management system that leverages AI to create personalized learning experiences. The architecture is scalable, the codebase is well-structured, and the features are designed to help students learn effectively by understanding prerequisites first.

The project demonstrates:
- Full-stack development (React + Express)
- Real-time communication (WebSocket)
- AI integration (OpenRouter/GPT-4o)
- Database design (MongoDB)
- Authentication & security (JWT)
- Modern development practices (TypeScript, Vite)

---

**Last Updated**: Based on current codebase analysis
**Version**: 1.0.0
**Maintainer**: Development Team

