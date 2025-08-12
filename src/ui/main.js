// UI JavaScript for Financial Forecasting Application

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('nav button');
    const views = document.querySelectorAll('.view');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all views
            views.forEach(view => view.classList.remove('active'));
            
            // Show the corresponding view
            const viewId = button.id.replace('-btn', '-view');
            const view = document.getElementById(viewId);
            if (view) {
                view.classList.add('active');
            }
            
            // Load data for the selected view
            loadViewData(button.id.replace('-btn', ''));
        });
    });
}

function setupEventListeners() {
    // Dashboard button event listeners
    const newScenarioBtn = document.getElementById('new-scenario-btn');
    if (newScenarioBtn) {
        newScenarioBtn.addEventListener('click', createNewScenario);
    }
}

function loadDashboardData() {
    // Load dashboard data from backend
    console.log('Loading dashboard data...');
    // This would typically make API calls to load real data
}

function loadViewData(viewName) {
    console.log(`Loading data for ${viewName} view...`);
    
    switch(viewName) {
        case 'scenarios':
            loadScenarios();
            break;
        case 'reports':
            loadReports();
            break;
        case 'billing':
            loadBillingData();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

function loadScenarios() {
    // Load scenarios data
    console.log('Loading scenarios...');
}

function loadReports() {
    // Load reports data
    console.log('Loading reports...');
}

function loadBillingData() {
    // Load billing data
    console.log('Loading billing data...');
}

function loadSettings() {
    // Load settings data
    console.log('Loading settings...');
}

function createNewScenario() {
    // Create a new financial scenario
    console.log('Creating new scenario...');
    alert('New scenario creation would be implemented here');
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        setupNavigation,
        loadDashboardData,
        loadViewData
    };
}
