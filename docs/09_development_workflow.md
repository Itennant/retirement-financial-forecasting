# Development Workflow and Branching Strategy

This document outlines the development workflow and branching strategy for the Retirement Financial Forecasting application with AI agents.

## Repository Structure

The project uses a branching strategy that facilitates collaborative development across multiple devices:

- `main` - Production-ready code
- `development` - Main development branch for ongoing work
- `feature/*` - Feature branches for specific functionality
  - `feature/user-management` - User authentication and management features
  - `feature/payment-processing` - Payment and billing functionality
  - `feature/ai-agents` - AI agent development and integration
  - `feature/reporting` - Financial reporting features
- `finivo` - Documentation branch

## Cloning the Repository

To get started with development, clone the repository to your local machine:

```bash
git clone https://github.com/Itennant/retirement-financial-forecasting.git
cd retirement-financial-forecasting
```

## Branching Workflow

### 1. Selecting a Branch

Switch to the appropriate branch for your work:

```bash
# For user management features
git checkout feature/user-management

# For payment processing features
git checkout feature/payment-processing

# For AI agent development
git checkout feature/ai-agents

# For reporting features
git checkout feature/reporting

# For general development
git checkout development
```

### 2. Making Changes

After switching to your working branch:

```bash
# Make your code changes
# ...

# Stage your changes
git add .

# Commit your changes with a descriptive message
git commit -m "Add new user authentication feature"

# Push your changes to the remote repository
git push origin feature/user-management
```

### 3. Syncing with Remote Changes

To sync with changes from other developers:

```bash
# Pull the latest changes from the remote branch
git pull origin feature/user-management
```

### 4. Merging Features

When a feature is complete:

1. Ensure your feature branch is up to date with the development branch:
   ```bash
   git checkout development
   git pull origin development
   git checkout feature/user-management
   git merge development
   ```

2. Resolve any merge conflicts if they occur.

3. Push the updated feature branch:
   ```bash
   git push origin feature/user-management
   ```

4. Create a pull request on GitHub to merge the feature branch into the development branch.

### 5. Release Process

For production releases:

1. Create a pull request from `development` to `main` on GitHub.
2. Review and approve the changes.
3. Merge the pull request to deploy to production.

## Best Practices

1. **Branch Naming**: Use descriptive names for feature branches (e.g., `feature/user-dashboard`, `bugfix/login-issue`).

2. **Commit Messages**: Write clear, concise commit messages that explain what changes were made and why.

3. **Regular Syncing**: Regularly pull changes from the remote repository to avoid large merge conflicts.

4. **Code Reviews**: Use pull requests for code reviews before merging features into the development branch.

5. **Branch Cleanup**: Delete feature branches after they've been merged to keep the repository clean.

## Working Across Multiple Devices

To work effectively across multiple devices:

1. Commit and push your changes regularly:
   ```bash
   git add .
   git commit -m "Work in progress on user dashboard"
   git push origin feature/user-management
   ```

2. When switching to another device, pull the latest changes:
   ```bash
   git pull origin feature/user-management
   ```

3. Use feature branches to isolate your work and avoid conflicts with other developers.

This workflow ensures that development can proceed smoothly across multiple devices while maintaining code quality and collaboration.
