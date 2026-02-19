#!/bin/bash

# FintechOps EC2 Setup Script
# Run this on a fresh Amazon Linux 2 EC2 instance

set -e

echo "🚀 Setting up FintechOps on EC2"

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo systemctl enable docker

# Install AWS CLI v2
echo "☁️  Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# Install Git
echo "📚 Installing Git..."
sudo yum install git -y

echo ""
echo "✅ Setup complete!"
echo ""
echo "⚠️  IMPORTANT: Log out and log back in for Docker permissions to take effect"
echo ""
echo "Next steps:"
echo "1. Exit and reconnect: exit"
echo "2. Configure AWS: aws configure"
echo "3. Clone repo or copy deploy.sh"
echo "4. Run: ./deploy.sh"
