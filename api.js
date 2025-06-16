// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

// API Helper Functions
class ExpenseAPI {
    
    // Save expense to database
    static async saveExpense(expenseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving expense:', error);
            throw error;
        }
    }
    
    // Get all expenses with optional filters
    static async getExpenses(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${API_BASE_URL}/expenses?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching expenses:', error);
            throw error;
        }
    }
    
    // Update expense
    static async updateExpense(id, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    }
    
    // Delete expense
    static async deleteExpense(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
        }
    }
    
    // Get analytics summary
    static async getAnalyticsSummary(dateRange = {}) {
        try {
            const queryParams = new URLSearchParams(dateRange);
            const response = await fetch(`${API_BASE_URL}/analytics/summary?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }
    
    // Get monthly trends
    static async getMonthlyTrends() {
        try {
            const response = await fetch(`${API_BASE_URL}/analytics/monthly`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching monthly trends:', error);
            throw error;
        }
    }
}

// Enhanced expense saving function
async function saveCurrentExpense() {
    try {
        // Validate required fields
        if (!selectedCategory || !currentAmount || currentAmount === '0.00') {
            alert('Please select a category and enter an amount');
            return false;
        }
        
        // Prepare expense data
        const expenseData = {
            type: currentType,
            date: selectedDate.toISOString().split('T')[0],
            amount: parseFloat(currentAmount),
            category: selectedCategory,
            subcategory: selectedSubcategory || ''
        };
        
        // Save to database
        const savedExpense = await ExpenseAPI.saveExpense(expenseData);
        
        // Show success message
        showNotification('💰 Expense saved successfully!', 'success');
        
        // Reset form
        resetForm();
        
        console.log('Expense saved:', savedExpense);
        return true;
        
    } catch (error) {
        console.error('Failed to save expense:', error);
        showNotification('❌ Failed to save expense. Please try again.', 'error');
        return false;
    }
}

// Load and display analytics
async function loadAnalytics() {
    try {
        showLoadingState();
        
        // Get current month data
        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        
        const analyticsData = await ExpenseAPI.getAnalyticsSummary({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
        
        const monthlyTrends = await ExpenseAPI.getMonthlyTrends();
        
        // Display analytics
        displayAnalytics(analyticsData, monthlyTrends);
        
    } catch (error) {
        console.error('Failed to load analytics:', error);
        showNotification('❌ Failed to load analytics', 'error');
    }
}

// Reset form function
function resetForm() {
    currentAmount = '0.00';
    selectedCategory = '';
    selectedSubcategory = '';
    updateDisplay();
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        default:
            notification.style.backgroundColor = '#333';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show loading state
function showLoadingState() {
    // Add loading indicator logic here
    console.log('Loading...');
}

// Display analytics function
function displayAnalytics(summary, trends) {
    // This will be implemented when we create the analytics UI
    console.log('Analytics Summary:', summary);
    console.log('Monthly Trends:', trends);
} 