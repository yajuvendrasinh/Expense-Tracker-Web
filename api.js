// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : '/api';

// API Helper Functions
class ExpenseAPI {
    static async fetchWithErrorHandling(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    static async saveExpense(expenseData) {
        return this.fetchWithErrorHandling(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            body: JSON.stringify(expenseData)
        });
    }
    
    static async getExpenses(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return this.fetchWithErrorHandling(`${API_BASE_URL}/expenses?${queryParams}`);
    }
    
    static async updateExpense(id, updates) {
        return this.fetchWithErrorHandling(`${API_BASE_URL}/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }
    
    static async deleteExpense(id) {
        return this.fetchWithErrorHandling(`${API_BASE_URL}/expenses/${id}`, {
            method: 'DELETE'
        });
    }
    
    static async getAnalyticsSummary(dateRange = {}) {
        const queryParams = new URLSearchParams(dateRange);
        return this.fetchWithErrorHandling(`${API_BASE_URL}/analytics/summary?${queryParams}`);
    }
    
    static async getMonthlyTrends() {
        return this.fetchWithErrorHandling(`${API_BASE_URL}/analytics/monthly`);
    }
}

// Enhanced expense saving function
async function saveCurrentExpense() {
    try {
        if (!selectedCategory || !currentAmount || currentAmount === '0.00' || !expenseName.trim()) {
            alert('Please fill in all required fields: Category, Amount, and Expense Name');
            return false;
        }
        
        if (categories[selectedCategory]?.length > 0 && !selectedSubcategory) {
            alert('Please select a subcategory');
            return false;
        }
        
        const expenseData = {
            type: currentType,
            date: selectedDate.toISOString().split('T')[0],
            amount: parseFloat(currentAmount),
            category: selectedCategory,
            subcategory: selectedSubcategory || '',
            expense_name: expenseName.trim()
        };
        
        const savedExpense = await ExpenseAPI.saveExpense(expenseData);
        showNotification('💰 Expense saved successfully!', 'success');
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
        
        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        
        const [analyticsData, monthlyTrends] = await Promise.all([
            ExpenseAPI.getAnalyticsSummary({
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            }),
            ExpenseAPI.getMonthlyTrends()
        ]);
        
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
    expenseName = '';
    updateDisplay();
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
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
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#333'
    });
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show loading state
function showLoadingState() {
    console.log('Loading...');
}

// Display analytics function
function displayAnalytics(summary, trends) {
    // This will be implemented when we create the analytics UI
} 