# 🤖 FAQ Agent — Smart Discord FAQ Bot

> **A full-stack FAQ management system with AI-powered semantic matching, built with React, Node.js, and MongoDB.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Backend on Render](https://img.shields.io/badge/Backend%20on-Render-00ADD8?style=flat&logo=render)](https://render.com)
[![Database on MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)

## 📋 Table of Contents

- [ Features](#-features)
- [ Tech Stack](#️-tech-stack)
- [ Project Structure](#-project-structure)
- [ Live Demo](#-live-demo)
- [ Quick Start](#-quick-start)
- [ API Endpoints](#-api-endpoints)
- [ Database Schema](#-database-schema)
- [ Deployment](#-deployment)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Authors](#-authors)

---

## 🚀 Features

###  **AI-Powered FAQ Matching**
- **Semantic Similarity**: Uses embeddings to understand user intent
- **Smart Matching**: Finds relevant FAQs even with different wording
- **Configurable Threshold**: Adjustable similarity matching (0.1-1.0)

###  **Analytics Dashboard**
- **Real-time Statistics**: Total FAQs, unanswered questions, accuracy rates
- **Activity Tracking**: Monitor bot performance and user interactions
- **Visual Charts**: Beautiful graphs showing usage patterns

###  **Admin Management**
- **FAQ Management**: Add, edit, delete FAQs with rich text editor
- **Settings Configuration**: Customize bot behavior and appearance
- **User Management**: Team collaboration with role-based access

###  **Self-Learning System**
- **Unknown Question Tracking**: Automatically saves questions that don't match
- **AI Suggestions**: Generates suggested answers for frequent questions
- **Admin Training**: Notifies admins when questions are asked 3+ times

###  **Security & Authentication**
- **JWT Authentication**: Secure login system
- **Role-based Access**: Admin and member permissions
- **Team Invitations**: Secure team member onboarding

---

## 🛠️ Tech Stack

### **Frontend**
-  **React 19** — Modern UI framework
-  **Tailwind CSS** — Utility-first styling
-  **Vite** — Fast build tool
-  **React Router** — Client-side routing
-  **React Hot Toast** — Beautiful notifications

### **Backend**
-  **Node.js** — JavaScript runtime
-  **Express.js** — Web framework
-  **JWT** — Authentication
-  **Nodemailer** — Email notifications
-  **OpenAI/Gemini** — AI embeddings

### **Database**
-  **MongoDB Atlas** — Cloud database
-  **Mongoose** — ODM for MongoDB
-  **MongoDB Driver** — Database connectivity

### **Deployment**
-  **Vercel** — Frontend hosting
-  **Render** — Backend hosting
-  **MongoDB Atlas** — Database hosting

---

## 📦 Project Structure

```
Agent-FAQ/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 components/          # Reusable UI components
│   ├── 📁 pages/              # Page components
│   ├── 📁 src/                # Source files
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── 📁 api/                    # API route handlers
│   ├── login.js              # Authentication
│   ├── settings.js           # App settings
│   ├── suggestions.js        # AI suggestions
│   ├── accept-invite.js      # Team invitations
│   └── ai-suggest.js         # AI generation
├── 📁 models/                # Database models
│   ├── User.js              # User schema
│   ├── Faq.js               # FAQ schema
│   ├── Settings.js          # Settings schema
│   ├── Analytics.js         # Analytics schema
│   └── TeamMember.js        # Team member schema
├── 📁 backend/              # Core backend logic
│   ├── embedding.js         # AI embeddings
│   ├── similarity.js        # Semantic matching
│   └── db.js               # Database utilities
├── 📁 utils/               # Utility functions
│   ├── sendEmail.js        # Email functionality
│   └── db.js              # Database helpers
├── server.js              # Main server file
├── package.json           # Backend dependencies
└── README.md             # This file
```

---

## 🌐 Live Demo

### **Frontend (Dashboard)**
```
http://agent-faq.vercel.app
```

### **Backend API**
```
https://agent-faq.onrender.com
```

---

## 🚦 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- MongoDB Atlas account
- GitHub account
- Vercel account (free)
- Render account (free)

### **1. Clone the Repository**
```bash
git clone https://github.com/DakshN07/Agent-FAQ.git
cd Agent-FAQ
```

### **2. Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### **3. Environment Setup**
Create a `.env` file in the root directory:
```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# AI Services
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Discord Bot (optional)
DISCORD_TOKEN=your_discord_bot_token

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

### **4. Run Locally**
```bash
# Start backend server
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### **5. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 🔧 API Endpoints

### **Authentication**
```http
POST /api/login              # User login
POST /api/accept-invite      # Accept team invitation
```

### **FAQ Management**
```http
GET    /api/faqs             # Get all FAQs
POST   /api/faqs             # Create new FAQ
PUT    /api/faqs/:id         # Update FAQ
DELETE /api/faqs/:id         # Delete FAQ
```

### **Analytics & Settings**
```http
GET    /api/analytics        # Get analytics data
GET    /api/settings         # Get app settings
PUT    /api/settings         # Update settings
GET    /api/suggestions      # Get AI suggestions
```

### **System**
```http
GET    /api/health           # Health check
GET    /api/unknown-questions # Get unknown questions
```

---

## 📊 Database Schema

### **User Model**
```javascript
{
  email: String,           // User email
  password: String,        // Hashed password
  name: String,           // User name
  role: String,           // 'admin' | 'member'
  createdAt: Date
}
```

### **FAQ Model**
```javascript
{
  question: String,        // FAQ question
  answer: String,         // FAQ answer
  guildId: String,        // Discord server ID
  embedding: [Number],    // AI embedding vector
  createdAt: Date
}
```

### **Settings Model**
```javascript
{
  similarityThreshold: Number,  // Matching threshold (0.1-1.0)
  maxSuggestions: Number,       // Max AI suggestions
  autoRespond: Boolean,         // Auto-response setting
  notificationEmail: String,    // Admin email
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### **Frontend Deployment (Vercel)**

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"

2. **Import Repository**
   - Select your `Agent-FAQ` repository
   - Set root directory to `frontend/`
   - Vercel auto-detects React + Vite

3. **Deploy**
   - Click "Deploy"
   - Get your live URL

### **Backend Deployment (Render)**

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New Web Service"
   - Connect your GitHub repo

2. **Configure Settings**
   - **Root Directory**: `/` (leave blank)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node

3. **Environment Variables**
   ```env
   MONGO_URI=your_mongodb_atlas_connection
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build completion

### **Database Setup (MongoDB Atlas)**

1. **Create Cluster**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create free cluster (M0)

2. **Database Access**
   - Create database user
   - Set username/password

3. **Network Access**
   - Allow access from anywhere (0.0.0.0/0)

4. **Get Connection String**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string

---

## 🔧 Configuration

### **CORS Setup**
If you get CORS errors, update your backend:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### **Environment Variables**
Make sure all required environment variables are set in Render:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key
- `DISCORD_TOKEN` - Discord bot token (optional)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 DakshN07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Authors

[![GitHub: DakshN07](https://img.shields.io/badge/GitHub-DakshN07-181717?style=flat&logo=github)](https://github.com/DakshN07)
[![GitHub: AyushBurde](https://img.shields.io/badge/GitHub-AyushBurde-181717?style=flat&logo=github)](https://github.com/AyushBurde)

- **[Daksh Nayak](https://github.com/DakshN07)** - *Frontend development, database & deployment*
- **[Ayush Burde](https://github.com/AyushBurde)** - *Main project concept, backend & architecture*

---

##  Acknowledgments

- **OpenAI** for AI embeddings and suggestions
- **Google Gemini** for alternative AI services
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **MongoDB Atlas** for database hosting
- **Discord.js** for Discord bot integration

---

##  Support

If you need help or have questions:

- 📧 **Email**: [dakshnayak635@gmail.com] [aayuworks7@gmail.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/DakshN07/Agent-FAQ/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/DakshN07/Agent-FAQ/discussions)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**🤖 Built with ❤️ for the developer community**

</div>
