// Main application entry point
import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';

// Load configuration
import config from './config/settings/app.config.js';

// Load database service
import DatabaseService from './core/services/database.service.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let databaseService;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Load the main UI
  mainWindow.loadFile(path.join(__dirname, 'ui/index.html'));

  // Open DevTools in development mode
  if (config.environment === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Initialize database service
  databaseService = new DatabaseService(config);
  
  // Create window after database is initialized
  createWindow();
  
  // Example of using the database service
  if (config.environment === 'development') {
    testDatabaseConnection();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Close database connections before quitting
    if (databaseService) {
      databaseService.close();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Test database connection in development mode
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Simple test query to verify connection
    if (config.database.client === 'supabase') {
      console.log('Using Supabase in development mode');
      // You can add specific Supabase tests here
    } else {
      console.log('Using SQLite in development mode');
      // You can add specific SQLite tests here
    }
    
    console.log('Database connection test completed');
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}
