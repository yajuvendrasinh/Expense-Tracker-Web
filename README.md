# Expense Tracker with Supabase Integration

A modern web application for tracking expenses with Supabase database integration and analytics.

## 🎯 Features

- ✅ **Clean UI** - Modern expense entry interface
- ✅ **Smart Date Selection** - Easy date navigation with calendar
- ✅ **Category Management** - Organized expense categories and subcategories
- ✅ **Supabase Integration** - Persistent data storage with PostgreSQL
- ✅ **Analytics Dashboard** - Expense insights and trends
- ✅ **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **Supabase Account** - [Sign up here](https://supabase.com/)

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

The application is pre-configured with Supabase credentials. The database table will be automatically created if it doesn't exist.

**Environment Variables (Optional):**
```bash
# Create .env file in project root if you want to customize
echo "PORT=3000" > .env
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
├── server.js           # Express backend with Supabase
├── package.json        # Dependencies
├── .env                # Environment variables (optional)
└── README.md           # This file
```

## 🔧 Configuration

### Supabase Setup

The application uses Supabase (PostgreSQL) for data storage. The database configuration is:

**Database URL:** `https://qrlqxlodzbtiuruwzryc.supabase.co`

**Table Schema:**
```sql
CREATE TABLE public.expenses (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'expenses',
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Environment Variables (.env)

Create a `.env` file in the project root if you want to customize settings:

```env
# Server Configuration
PORT=3000
```

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

#### 1. Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
```bash
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /F /PID <process_id>

# Or change port in .env file
echo "PORT=3001" >> .env
```

#### 2. Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
npm install
```

#### 3. Database Connection Issues
The application should automatically work with the configured Supabase instance. If you encounter issues:

1. Check if the server logs show "✅ Supabase client initialized"
2. Verify the application can create test expenses
3. Check browser console for any frontend errors

## 🔄 Data Schema

### Expense Document
```javascript
{
    id: number,
    type: "expenses" | "analysis",
    date: string (ISO date),
    amount: number,
    category: string,
    subcategory: string,
    created_at: string (ISO datetime)
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

### Technology Stack
- **Frontend**: Vanilla JavaScript with modern ES6+
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with responsive design

### Running in Development Mode
```bash
npm run dev
```

### Key Features Implementation
- Real-time data persistence with Supabase
- Clean black/white/gray design theme
- Mobile-responsive interface
- Weekend highlighting in calendar
- Today button for quick date navigation

## 📝 Notes

- Data persists in Supabase PostgreSQL database
- Categories are predefined but can be extended
- Weekend dates have subtle highlighting in calendar
- Clean UI with professional SVG icons
- Compact calendar design with optimized spacing

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
- Ensure the server is running on port 3000
- Check browser console for errors 