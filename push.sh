#!/bin/bash

# FintechOps - Git Push Script
# Pushes all new services and pipeline changes

set -e  # Exit on error

echo "🚀 FintechOps - Pushing to Git"
echo "================================"

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'main'"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

# Check git status
echo ""
echo "📊 Current Status:"
git status --short

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit"
    exit 0
fi

# Add all changes
echo ""
echo "📦 Adding files..."
git add .

# Show what will be committed
echo ""
echo "📝 Files to commit:"
git diff --cached --name-only

# Commit
echo ""
read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Add market-data and news services with production pipeline"
fi

git commit -m "$COMMIT_MSG"

# Push
echo ""
echo "🚀 Pushing to remote..."
git push origin "$CURRENT_BRANCH"

echo ""
echo "✅ Push complete!"
echo ""
echo "Next steps:"
echo "1. Go to Jenkins: http://your-jenkins-url:8080"
echo "2. Click 'Build with Parameters' on fintechops-cicd job"
echo "3. Select SERVICE: market-data-service or news-service"
echo "4. Select ENVIRONMENT: dev or prod"
echo "5. Click 'Build'"
echo ""
echo "📊 Monitor build: http://your-jenkins-url:8080/job/fintechops-cicd/"
