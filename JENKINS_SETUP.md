# Jenkins CI/CD Setup Guide

## Prerequisites

### 1. Jenkins Plugins Required
Install these plugins from Manage Jenkins → Manage Plugins:
- **Git** (REQUIRED - install this first!)
- Pipeline
- Docker Pipeline
- AWS Steps
- SonarQube Scanner
- Credentials Binding
- GitHub Integration (for webhooks)

### 2. Jenkins Credentials Setup

#### AWS Credentials
1. Go to Jenkins → Manage Jenkins → Credentials
2. Add new credentials:
   - Kind: AWS Credentials
   - ID: `aws-credentials`
   - Access Key ID: Your AWS Access Key
   - Secret Access Key: Your AWS Secret Key

#### SonarQube Token
1. Generate token in SonarQube
2. Add to Jenkins:
   - Kind: Secret text
   - ID: `sonarqube-token`
   - Secret: Your SonarQube token

### 3. Jenkins Global Tool Configuration

#### SonarQube Scanner
1. Go to Manage Jenkins → Global Tool Configuration
2. Add SonarQube Scanner:
   - Name: `SonarScanner`
   - Install automatically: Yes

#### Docker Access (Jenkins in Docker)
Jenkins is running in Docker container with Docker socket mounted:
```bash
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins_home:/var/jenkins_home \
  -p 8080:8080 -p 50000:50000 \
  --name jenkins \
  jenkins/jenkins:lts
```

This allows Jenkins to:
- Build Docker images on the host
- Access Trivy installed on EC2 host
- Run docker commands without installing Docker inside container

### 4. SonarQube Server Configuration
1. Go to Manage Jenkins → Configure System
2. Add SonarQube server:
   - Name: `SonarQube`
   - Server URL: Your SonarQube URL
   - Server authentication token: Select `sonarqube-token`

### 5. Trivy Setup (Already on EC2)
Trivy is already installed on the EC2 host machine and accessible to Jenkins container.
No additional installation needed.

### 6. Create ECR Repositories

Create one repository per environment in Mumbai region:
```bash
# Create DEV repository
aws ecr create-repository --repository-name fintechops-dev --region ap-south-1 --image-scanning-configuration scanOnPush=true

# Create PROD repository
aws ecr create-repository --repository-name fintechops-prod --region ap-south-1 --image-scanning-configuration scanOnPush=true
```

All microservices will use the same repo with different image tags.
See `ECR_DESIGN.md` for tagging strategy.

### 7. Jenkins Pipeline Setup

#### Install Git Plugin First
1. Go to Manage Jenkins → Manage Plugins → Available
2. Search for "**Git Parameter**" (this includes base Git plugin)
3. Check the box and click "Install without restart"
4. Wait for installation to complete
5. Go back to Jenkins dashboard

#### Create Single Pipeline Job for All Services
1. New Item → Pipeline
2. Name: `fintechops-cicd`
3. Check "This project is parameterized"
4. Add parameters:
   - Choice Parameter Name: `ENVIRONMENT`
     - Choices (enter each on NEW LINE, NO COMMAS):
       ```
       dev
       prod
       ```
   - Choice Parameter Name: `SERVICE`
     - Choices (enter each on NEW LINE, NO COMMAS):
       ```
       auth-service
       payment-service
       all
       ```
5. Pipeline Definition: **Pipeline script from SCM**
6. SCM: **Git**
7. Repository URL: Your Git repo URL (e.g., `https://github.com/username/Fintechops.git`)
8. Credentials: Add if private repo
9. Branch: `*/main` or `*/master`
10. Script Path: `Jenkinsfile`
11. Save

#### Configure Webhook (GitHub)
1. Go to GitHub repo → Settings → Webhooks
2. Add webhook:
   - Payload URL: `http://your-jenkins-url/github-webhook/`
   - Content type: `application/json`
   - Events: Push events

#### Configure Webhook (GitLab)
1. Go to GitLab repo → Settings → Webhooks
2. Add webhook:
   - URL: `http://your-jenkins-url/project/fintechops-cicd`
   - Trigger: Push events

### 8. Environment Variables

**Method 1: Global Properties (Recommended)**
1. Go to Manage Jenkins → Configure System
2. Scroll to Global properties
3. Check Environment variables
4. Click Add:
   - Name: AWS_ACCOUNT_ID
   - Value: Your 12-digit AWS Account ID
5. Click Add again:
   - Name: AWS_REGION
   - Value: ap-south-1
6. Click Save

**Method 2: In Jenkinsfile**
Add to environment block:
```groovy
environment {
    AWS_ACCOUNT_ID = 'your-account-id'
    AWS_REGION = 'ap-south-1'
}
```

## Pipeline Stages

1. **Checkout**: Pull code from Git via webhook
2. **SonarQube Analysis**: Code quality scan for backend & frontend
3. **Quality Gate**: Wait for SonarQube quality gate
4. **Build Images**: Build Docker images for backend & frontend
5. **Trivy Scan**: Security vulnerability scan
6. **Push to ECR**: Push images to AWS ECR
7. **Cleanup**: Remove local images

## Usage

### Deploy Specific Service to DEV
```
Build with Parameters:
- ENVIRONMENT: dev
- SERVICE: auth-service
```

### Deploy All Services to PROD
```
Build with Parameters:
- ENVIRONMENT: prod
- SERVICE: all
```

## Image Tags
- Commit-based: `{git-commit-sha}-{environment}`
- Latest: `{environment}-latest`

Example:
- `abc1234-dev`
- `dev-latest`
- `abc1234-prod`
- `prod-latest`
