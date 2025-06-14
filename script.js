// Categories and Subcategories Data
const categories = {
    'Accommodation': ['Rent', 'Food', 'Electronics', 'Flat Maintenance', 'Other Things', 'Light Bill', 'Laundry'],
    'Food': ['Tiffin', 'Outside Food', 'Fast Food', 'Eggs', 'Swiggy', 'Zomato', 'Food With Friends', 'Soft Drink', 'Water bottle', 'Packets', 'Healthy Food', 'Sweet', 'Drink'],
    'Personal Care': ['Haircut', 'Skin Care Products'],
    'Health': ['Doctor Fees', 'Medicine', 'Medical Tests'],
    'Transport': ['Fuel', 'Maintenance', 'Bus Ticket', 'Auto rickshaw', 'Accessories & Parts', 'City Bus', 'Train Ticket'],
    'Monthly Bills': ['My Mobile Bill', 'Mummy\'s Mobile Bill', 'Subscriptions'],
    'Grocery': ['Home Grocery', 'Anand Grocery'],
    'Shoping': ['Amazon', 'Flipkart', 'Clothing', 'Electronics', 'Ajio', 'Myntra', 'Others'],
    'Education & Job Applications': ['Exam Fees', 'Course Fees', 'PHD Fees', 'Stationery', 'Print & Xerox', 'PHD Related'],
    'Social': [],
    'Other': []
};

// Global variables
let selectedDate = new Date();
let selectedCategory = '';
let selectedSubcategory = '';
let currentAmount = '0.00';
let currentType = 'expenses';

// DOM Elements
const dateList = document.getElementById('dateList');
const categoryBtn = document.getElementById('categoryBtn');
const subcategoryBtn = document.getElementById('subcategoryBtn');
const amountInput = document.getElementById('amountInput');
const clearBtn = document.getElementById('clearBtn');
const calendarBtn = document.getElementById('calendarBtn');

// Modal Elements
const categoryModal = document.getElementById('categoryModal');
const subcategoryModal = document.getElementById('subcategoryModal');
const calendarModal = document.getElementById('calendarModal');
const amountModal = document.getElementById('amountModal');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDates();
    initializeEventListeners();
    updateDisplay();
});

// Initialize date selection (2 previous + today + 1 next day)
function initializeDates() {
    const today = new Date();
    selectedDate = new Date(today);
    
    // Use the common date display logic
    updateDateDisplay();
}

// Select date
function selectDate(date, element) {
    selectedDate = new Date(date);
    // Update the entire date display to show new range
    updateDateDisplay();
}

// Initialize event listeners
function initializeEventListeners() {
    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
        });
    });

    // Category button
    categoryBtn.addEventListener('click', () => {
        showCategoryModal();
    });

    // Subcategory button
    subcategoryBtn.addEventListener('click', () => {
        if (selectedCategory) {
            showSubcategoryModal();
        } else {
            alert('Please select a category first');
        }
    });

    // Amount input - make the entire amount container clickable
    const amountContainer = document.querySelector('.amount-input');
    amountContainer.addEventListener('click', () => {
        showAmountModal();
    });
    
    amountInput.addEventListener('click', () => {
        showAmountModal();
    });

    // Clear button - now works as backspace
    clearBtn.addEventListener('click', () => {
        if (currentAmount.length > 1 && currentAmount !== '0.00') {
            currentAmount = currentAmount.slice(0, -1);
            
            // Make sure we don't end with just a decimal point
            if (currentAmount.endsWith('.')) {
                currentAmount = currentAmount.slice(0, -1);
            }
            
            // If we removed everything, reset to 0.00
            if (currentAmount === '' || currentAmount === '0') {
                currentAmount = '0.00';
            }
        } else {
            currentAmount = '0.00';
        }
        updateDisplay();
    });

    // Calendar button
    calendarBtn.addEventListener('click', () => {
        showCalendarModal();
    });

    // Close modal buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Amount modal functionality
    initializeAmountModal();
}

// Show category modal
function showCategoryModal() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    
    Object.keys(categories).forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-list-item';
        button.textContent = category;
        button.addEventListener('click', () => {
            selectedCategory = category;
            selectedSubcategory = '';
            updateDisplay();
            closeAllModals();
        });
        categoryList.appendChild(button);
    });
    
    categoryModal.classList.add('active');
}

// Show subcategory modal
function showSubcategoryModal() {
    const subcategoryList = document.getElementById('subcategoryList');
    subcategoryList.innerHTML = '';
    
    if (categories[selectedCategory] && categories[selectedCategory].length > 0) {
        categories[selectedCategory].forEach(subcategory => {
            const button = document.createElement('button');
            button.className = 'subcategory-list-item';
            button.textContent = subcategory;
            button.addEventListener('click', () => {
                selectedSubcategory = subcategory;
                updateDisplay();
                closeAllModals();
            });
            subcategoryList.appendChild(button);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = 'No subcategories available for this category';
        message.style.textAlign = 'center';
        message.style.color = '#666';
        subcategoryList.appendChild(message);
    }
    
    subcategoryModal.classList.add('active');
}

// Show amount modal
function showAmountModal() {
    const amountDisplay = document.getElementById('amountDisplay');
    
    amountDisplay.textContent = formatAmountDisplay(currentAmount);
    
    // Reset the temp amount when modal opens
    if (window.resetAmountModal) {
        window.resetAmountModal();
    }
    
    amountModal.classList.add('active');
}

// Initialize amount modal functionality
function initializeAmountModal() {
    let tempAmount = '0.00';
    
    const amountDisplay = document.getElementById('amountDisplay');
    const keyButtons = document.querySelectorAll('.key-btn');
    const backspaceBtn = document.getElementById('backspaceAmount');
    const confirmBtn = document.getElementById('confirmAmount');
    
    keyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            
            if (key === 'backspace') {
                if (tempAmount.length > 1) {
                    tempAmount = tempAmount.slice(0, -1);
                } else {
                    tempAmount = '0.00';
                }
            } else if (key === '.') {
                if (!tempAmount.includes('.')) {
                    tempAmount += '.';
                }
            } else {
                if (tempAmount === '0.00') {
                    tempAmount = key;
                } else {
                    tempAmount += key;
                }
            }
            
            // Format amount
            if (tempAmount.includes('.')) {
                const parts = tempAmount.split('.');
                if (parts[1] && parts[1].length > 2) {
                    tempAmount = parts[0] + '.' + parts[1].substring(0, 2);
                }
            }
            
            amountDisplay.textContent = formatAmountDisplay(tempAmount);
        });
    });
    
    backspaceBtn.addEventListener('click', () => {
        if (tempAmount.length > 1) {
            tempAmount = tempAmount.slice(0, -1);
        } else {
            tempAmount = '0.00';
        }
        
        // Make sure we don't end with just a decimal point
        if (tempAmount.endsWith('.')) {
            tempAmount = tempAmount.slice(0, -1);
        }
        
        amountDisplay.textContent = formatAmountDisplay(tempAmount);
    });
    
    confirmBtn.addEventListener('click', () => {
        // Ensure proper formatting
        if (!tempAmount.includes('.')) {
            tempAmount += '.00';
        } else {
            const parts = tempAmount.split('.');
            if (parts[1].length === 1) {
                tempAmount += '0';
            } else if (parts[1].length === 0) {
                tempAmount += '00';
            }
        }
        
        currentAmount = tempAmount;
        updateDisplay();
        closeAllModals();
    });
    
    // Reset temp amount when modal opens
    const resetTempAmount = () => {
        tempAmount = currentAmount;
        if (amountDisplay) {
            amountDisplay.textContent = formatAmountDisplay(tempAmount);
        }
    };
    
    // Call reset when the modal is shown
    window.resetAmountModal = resetTempAmount;
}

// Show calendar modal
function showCalendarModal() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Update modal header with navigation and month/year
    const modalHeader = document.querySelector('#calendarModal .modal-header');
    modalHeader.innerHTML = '';
    
    // Create header with navigation
    const headerContent = document.createElement('div');
    headerContent.className = 'modal-header-content';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn nav-prev';
    prevBtn.innerHTML = '‹';
    prevBtn.addEventListener('click', () => {
        selectedDate.setMonth(selectedDate.getMonth() - 1);
        showCalendarModal();
    });
    
    const title = document.createElement('h3');
    title.textContent = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn nav-next';
    nextBtn.innerHTML = '›';
    nextBtn.addEventListener('click', () => {
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        showCalendarModal();
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => {
        closeAllModals();
    });
    
    headerContent.appendChild(prevBtn);
    headerContent.appendChild(title);
    headerContent.appendChild(nextBtn);
    modalHeader.appendChild(headerContent);
    modalHeader.appendChild(closeBtn);
    
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar';
    
    // Day headers - start with Monday
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get first day of month and number of days
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Adjust for Monday start (0=Sunday becomes 6, 1=Monday becomes 0, etc.)
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayBtn = document.createElement('button');
        dayBtn.className = 'calendar-day other-month';
        dayBtn.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(dayBtn);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayBtn = document.createElement('button');
        dayBtn.className = 'calendar-day';
        dayBtn.textContent = day;
        
        // Check if this is the selected date
        if (day === selectedDate.getDate() && 
            currentMonth === selectedDate.getMonth() && 
            currentYear === selectedDate.getFullYear()) {
            dayBtn.classList.add('active');
        }
        
        dayBtn.addEventListener('click', () => {
            const newDate = new Date(currentYear, currentMonth, day);
            selectedDate = newDate;
            updateDateDisplay();
            closeAllModals();
        });
        
        calendarGrid.appendChild(dayBtn);
    }
    
    // Only add next month days if needed to complete the current week
    const totalFilledCells = firstDay + daysInMonth;
    const remainingInWeek = totalFilledCells % 7;
    if (remainingInWeek !== 0) {
        const cellsToAdd = 7 - remainingInWeek;
        for (let day = 1; day <= cellsToAdd; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day other-month';
            dayBtn.textContent = day;
            calendarGrid.appendChild(dayBtn);
        }
    }
    
    calendar.appendChild(calendarGrid);
    calendarModal.classList.add('active');
}

// Update date display - show 2 previous + selected + 1 next day
function updateDateDisplay() {
    dateList.innerHTML = '';
    
    // Create date range: 2 previous + selected + 1 next
    for (let i = -2; i <= 1; i++) {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() + i);
        
        const dateItem = document.createElement('button');
        dateItem.className = 'date-item';
        if (i === 0) dateItem.classList.add('active'); // Mark selected date as active
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        
        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
        
        dateItem.appendChild(dayNumber);
        dateItem.appendChild(dayName);
        
        // Add click event to allow selection of these dates
        dateItem.addEventListener('click', () => selectDate(date, dateItem));
        dateList.appendChild(dateItem);
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Update display
function updateDisplay() {
    amountInput.value = formatAmountDisplay(currentAmount);
    categoryBtn.textContent = selectedCategory || 'Category';
    subcategoryBtn.textContent = selectedSubcategory || 'Sub Category';
    
    // Add visual feedback for selected items
    if (selectedCategory) {
        categoryBtn.classList.add('selected');
    } else {
        categoryBtn.classList.remove('selected');
    }
    
    if (selectedSubcategory) {
        subcategoryBtn.classList.add('selected');
    } else {
        subcategoryBtn.classList.remove('selected');
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
}

// Utility function to format amount for display (removes .00 if no decimal value)
function formatAmountDisplay(amount) {
    if (typeof amount === 'string' && amount.endsWith('.00')) {
        return amount.slice(0, -3);
    }
    return amount;
}

// Export data (for future MongoDB integration)
function getExpenseData() {
    return {
        type: currentType,
        date: selectedDate.toISOString().split('T')[0],
        amount: parseFloat(currentAmount),
        category: selectedCategory,
        subcategory: selectedSubcategory,
        timestamp: new Date().toISOString()
    };
} 