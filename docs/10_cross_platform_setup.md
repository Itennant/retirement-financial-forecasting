# Cross-Platform Development Setup

This document outlines the necessary setup and utilities required to develop and run the Financial Forecasting Application on both macOS and Windows devices.

## Overview

The Financial Forecasting Application is built with Electron, which allows it to run on multiple platforms including:
- macOS (10.10 and later)
- Windows (7 and later)
- Linux (Ubuntu 12.04, Fedora 21, Debian 8 and later)

## Prerequisites

Both platforms require the following to be installed:

1. **Node.js** (version 14 or later)
2. **npm** (comes with Node.js) or **yarn**
3. **Git**

## macOS Setup

### 1. Install Homebrew (if not already installed)
Homebrew is a package manager for macOS that makes it easy to install development tools.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and npm
Using Homebrew:
```bash
brew install node
```

Or download from the official website: https://nodejs.org/

### 3. Install Git
Using Homebrew:
```bash
brew install git
```

Or download from the official website: https://git-scm.com/

### 4. Install project dependencies
Navigate to the project directory and install dependencies:
```bash
cd retirement-financial-forecasting
npm install
```

### 5. Additional macOS-specific tools (optional but recommended)
- **Visual Studio Code**: https://code.visualstudio.com/
- **Xcode Command Line Tools** (for some native modules):
  ```bash
  xcode-select --install
  ```

## Windows Setup

### 1. Install Node.js and npm
Download from the official website: https://nodejs.org/
Choose the LTS version for stability.

### 2. Install Git
Download from the official website: https://git-scm.com/
During installation, choose the recommended options.

### 3. Install Python (required for some native modules)
Download Python 3.x from: https://www.python.org/downloads/
During installation, make sure to check "Add Python to PATH"

### 4. Install Windows Build Tools (required for some native modules)
Open PowerShell as Administrator and run:
```powershell
npm install -g windows-build-tools
```

Alternatively, you can install Visual Studio Build Tools:
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022

### 5. Install project dependencies
Navigate to the project directory and install dependencies:
```cmd
cd retirement-financial-forecasting
npm install
```

### 6. Additional Windows-specific tools (optional but recommended)
- **Visual Studio Code**: https://code.visualstudio.com/
- **Windows Terminal**: https://github.com/microsoft/terminal

## Development Workflow

### Running the Application
Both platforms use the same commands:

```bash
# Start the application in development mode
npm run dev

# Run tests
npm test

# Build for distribution
npm run dist
```

### Platform-Specific Considerations

1. **File Paths**: The application uses Node.js path modules to handle cross-platform file paths correctly.

2. **Environment Variables**: 
   - macOS/Linux: `NODE_ENV=development`
   - Windows: `set NODE_ENV=development` or use cross-env package

3. **Line Endings**: Git can automatically handle line ending conversions:
   ```bash
   git config --global core.autocrlf true  # Windows
   git config --global core.autocrlf input # macOS/Linux
   ```

## Troubleshooting

### Common Issues on Windows

1. **Python not found**: Ensure Python is installed and added to PATH
2. **Build tools missing**: Install windows-build-tools or Visual Studio Build Tools
3. **Permission errors**: Run command prompt as Administrator when installing global packages

### Common Issues on macOS

1. **Permission errors with npm**: 
   ```bash
   sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
   ```
2. **Xcode Command Line Tools**: Install with `xcode-select --install`

## Building for Distribution

The application can be built for all platforms using:
```bash
npm run dist
```

This will create distributable packages for:
- macOS: .dmg, .zip
- Windows: .exe, .msi
- Linux: .AppImage, .deb, .rpm

## Version Control

The project uses Git for version control. Ensure you have the same Git configuration on all devices:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Recommended Development Tools

### Both Platforms
1. **Visual Studio Code** with extensions:
   - ESLint
   - Prettier
   - GitLens
   - Bracket Pair Colorizer

2. **Git GUI Clients** (optional):
   - GitHub Desktop
   - SourceTree
   - GitKraken

### macOS Specific
1. **iTerm2** - Enhanced terminal
2. **Homebrew** - Package manager

### Windows Specific
1. **Windows Terminal** - Enhanced terminal
2. **Chocolatey** - Package manager

## Conclusion

By following these setup instructions, developers can work on the Financial Forecasting Application on both macOS and Windows devices with minimal differences in the development workflow. The Electron framework ensures that the application will behave consistently across platforms.
