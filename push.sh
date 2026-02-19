#!/bin/bash

# FintechOps - Git Push Script
# Pushes all new services and pipeline changes

echo "🚀 FintechOps - Pushing to Git"
echo "================================"

# Check git status
echo ""
echo "📊 Current Status:"
git status --short

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
git push origin main

echo ""
echo "✅ Push complete!"
echo ""
echo "Next steps:"
echo "1. Go to Jenkins"
echo "2. Click 'Build with Parameters'"
echo "3. Select SERVICE and ENVIRONMENT"
echo "4. Click 'Build'"
