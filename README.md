# Expense Tracker with MongoDB Integration

A modern web application for tracking expenses with MongoDB database integration and analytics.

## 🎯 Features

- ✅ **Clean UI** - Modern expense entry interface
- ✅ **Smart Date Selection** - Easy date navigation with calendar
- ✅ **Category Management** - Organized expense categories and subcategories
- ✅ **MongoDB Integration** - Persistent data storage
- ✅ **Analytics Dashboard** - Expense insights and trends
- ✅ **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Local MongoDB** - [Download here](https://www.mongodb.com/download-center/community)
   - **MongoDB Atlas** (Cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

### Setup Instructions

#### 1. Clone/Download the Project
```bash
# If using git
git clone <your-repo-url>
cd expense-tracker

# Or download and extract the files
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Database Connection

**Option A: Local MongoDB**
```bash
# Create .env file in project root
echo "MONGODB_URI=mongodb://localhost:27017/expense-tracker" > .env
echo "PORT=3000" >> .env
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get your connection string
4. Create `.env` file:
```bash
# Replace with your actual connection string
echo "MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority" > .env
echo "PORT=3000" >> .env
```

#### 4. Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

#### 5. Open in Browser
Visit: **http://localhost:3000**

## 📁 Project Structure

```
expense-tracker/
├── index.html          # Main web interface
├── styles.css          # Application styling
├── script.js           # Frontend logic
├── api.js              # API integration
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env                # Environment variables
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables (.env)

Create a `.env` file in the project root:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# Server Configuration
PORT=3000

# For MongoDB Atlas, use this format:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

### MongoDB Atlas Setup (Detailed)

1. **Sign Up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**:
   - Choose "Shared" (free tier)
   - Select your preferred region
   - Click "Create Cluster"
3. **Database Access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username/password
   - Set permissions to "Read and write to any database"
4. **Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allow all) or your specific IP
5. **Get Connection String**:
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## 📊 API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/analytics/summary` - Get expense summary
- `GET /api/analytics/monthly` - Get monthly trends

### Example API Usage

```javascript
// Save an expense
const expense = {
    type: 'expenses',
    date: '2025-06-15',
    amount: 250.00,
    category: 'Food',
    subcategory: 'Lunch'
};

fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
});
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solutions:**
- Check if MongoDB is running locally
- Verify connection string in `.env`
- For Atlas: Check network access and credentials

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
```bash
# Change port in .env file
echo "PORT=3001" >> .env
```

#### 3. Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
npm install
```

### Testing Database Connection

```bash
# Test local MongoDB
mongosh mongodb://localhost:27017/expense-tracker

# Test Atlas connection
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/expense-tracker" --username <username>
```

## 🔄 Data Schema

### Expense Document
```javascript
{
    _id: ObjectId,
    type: "expenses" | "analysis",
    date: Date,
    amount: Number,
    category: String,
    subcategory: String,
    createdAt: Date
}
```

## 📱 Usage

### Adding Expenses
1. Select date (defaults to today)
2. Enter amount using the keypad
3. Choose category and subcategory
4. Click "💾 Save Expense"

### Viewing Analytics
1. Click "Analysis" tab
2. Click "📊 View Analytics"
3. View category breakdown and trends

## 🚀 Development

### Running in Development Mode
```bash
npm run dev
```

### Key Features Implementation
- **Frontend**: Vanilla JavaScript with modern ES6+
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with responsive design

## 📝 Notes

- Data persists in MongoDB database
- Categories are predefined but can be extended
- Weekend highlighting in calendar
- Clean black/white/gray design theme
- Mobile-responsive interface

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

**Need Help?** 
- Check the troubleshooting section above
- Verify all dependencies are installed
- Ensure MongoDB is running and accessible
- Check browser console for errors 