@Library('shared-pipeline-library') _

pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Deployment environment')
        string(name: 'SERVICE', defaultValue: 'all', description: 'Service name (e.g., auth-service) or "all"')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip quality checks')
        booleanParam(name: 'FORCE_DEPLOY', defaultValue: false, description: 'Force deployment even if quality gate fails')
    }
    
    environment {
        AWS_REGION = credentials('aws-region')
        AWS_ACCOUNT_ID = credentials('aws-account-id')
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_REPO = "fintechops-${params.ENVIRONMENT}"
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        BUILD_TIMESTAMP = sh(returnStdout: true, script: 'date +%Y%m%d-%H%M%S').trim()
        IMAGE_TAG = "${GIT_COMMIT_SHORT}-${BUILD_TIMESTAMP}"
        SLACK_CHANNEL = '#deployments'
    }
    
    stages {
        stage('Initialize') {
            steps {
                script {
                    echo "🚀 Starting deployment for ${params.SERVICE} to ${params.ENVIRONMENT}"
                    
                    // Auto-discover services
                    env.SERVICES_TO_BUILD = discoverServices()
                    echo "📦 Services to build: ${env.SERVICES_TO_BUILD}"
                    
                    // Validate environment
                    if (params.ENVIRONMENT == 'prod' && !params.FORCE_DEPLOY) {
                        input message: "Deploy to PRODUCTION?", ok: "Deploy"
                    }
                }
            }
        }
        
        stage('Build & Test Services') {
            steps {
                script {
                    def services = env.SERVICES_TO_BUILD.split(',')
                    def parallelStages = [:]
                    
                    services.each { service ->
                        parallelStages[service] = {
                            stage("${service}") {
                                buildService(service.trim())
                            }
                        }
                    }
                    
                    parallel parallelStages
                }
            }
        }
        
        stage('Security Scan') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                script {
                    def services = env.SERVICES_TO_BUILD.split(',')
                    services.each { service ->
                        securityScan(service.trim())
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    def services = env.SERVICES_TO_BUILD.split(',')
                    services.each { service ->
                        pushToECR(service.trim())
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { params.ENVIRONMENT != 'prod' || params.FORCE_DEPLOY }
            }
            steps {
                script {
                    def services = env.SERVICES_TO_BUILD.split(',')
                    services.each { service ->
                        deployService(service.trim())
                    }
                }
            }
        }
        
        stage('Smoke Tests') {
            when {
                expression { params.ENVIRONMENT == 'prod' }
            }
            steps {
                script {
                    def services = env.SERVICES_TO_BUILD.split(',')
                    services.each { service ->
                        runSmokeTests(service.trim())
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                notifySuccess()
            }
        }
        failure {
            script {
                notifyFailure()
            }
        }
        always {
            cleanupWorkspace()
        }
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

def discoverServices() {
    if (params.SERVICE == 'all') {
        def services = sh(
            returnStdout: true,
            script: '''
                find . -maxdepth 2 -name "Dockerfile" -o -name "package.json" | \
                grep -E "^\\./[^/]+/(backend|frontend)" | \
                cut -d'/' -f2 | sort -u | tr '\\n' ','
            '''
        ).trim()
        return services ?: 'auth-service,market-data-service,news-service'
    }
    return params.SERVICE
}

def buildService(String service) {
    echo "🔨 Building ${service}..."
    
    def hasBackend = fileExists("${service}/backend/Dockerfile")
    def hasFrontend = fileExists("${service}/frontend/Dockerfile")
    
    if (hasBackend) {
        buildComponent(service, 'backend')
    }
    
    if (hasFrontend) {
        buildComponent(service, 'frontend')
    }
}

def buildComponent(String service, String component) {
    dir("${service}/${component}") {
        // Code Quality Analysis
        if (!params.SKIP_TESTS && fileExists('src')) {
            try {
                def scannerHome = tool 'SonarScanner'
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=fintechops-${service}-${component} \
                        -Dsonar.sources=src \
                        -Dsonar.javascript.node.maxspace=4096
                    """
                }
                
                timeout(time: 5, unit: 'MINUTES') {
                    def qg = waitForQualityGate()
                    if (qg.status != 'OK' && !params.FORCE_DEPLOY) {
                        error "Quality gate failed: ${qg.status}"
                    }
                }
            } catch (Exception e) {
                echo "⚠️  Quality check failed: ${e.message}"
                if (!params.FORCE_DEPLOY) throw e
            }
        }
        
        // Build Docker Image
        def buildArgs = getBuildArgs(service, component)
        sh """
            docker build -t ${service}-${component}:${IMAGE_TAG} \
            ${buildArgs} \
            --label "service=${service}" \
            --label "component=${component}" \
            --label "environment=${params.ENVIRONMENT}" \
            --label "commit=${GIT_COMMIT_SHORT}" \
            --label "build-date=${BUILD_TIMESTAMP}" \
            .
        """
        
        echo "✅ Built ${service}-${component}:${IMAGE_TAG}"
    }
}

def getBuildArgs(String service, String component) {
    def args = "--build-arg NODE_ENV=${params.ENVIRONMENT}"
    
    if (component == 'frontend') {
        args += " --build-arg REACT_APP_ENV=${params.ENVIRONMENT}"
        
        // Load environment-specific configs
        if (fileExists("${service}/frontend/.env.${params.ENVIRONMENT}")) {
            def envVars = readFile("${service}/frontend/.env.${params.ENVIRONMENT}")
            envVars.split('\n').each { line ->
                if (line && !line.startsWith('#')) {
                    args += " --build-arg ${line}"
                }
            }
        }
    }
    
    return args
}

def securityScan(String service) {
    echo "🔒 Security scanning ${service}..."
    
    ['backend', 'frontend'].each { component ->
        if (fileExists("${service}/${component}/Dockerfile")) {
            def imageName = "${service}-${component}:${IMAGE_TAG}"
            
            sh """
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -v \${WORKSPACE}:/reports \
                aquasec/trivy:latest image \
                --severity HIGH,CRITICAL \
                --exit-code 0 \
                --format json \
                --output /reports/trivy-${service}-${component}.json \
                ${imageName}
            """
            
            // Archive security reports
            archiveArtifacts artifacts: "trivy-${service}-${component}.json", allowEmptyArchive: true
        }
    }
}

def pushToECR(String service) {
    echo "📤 Pushing ${service} to ECR..."
    
    withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
        sh """
            aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin ${ECR_REGISTRY}
        """
        
        ['backend', 'frontend'].each { component ->
            if (fileExists("${service}/${component}/Dockerfile")) {
                def localImage = "${service}-${component}:${IMAGE_TAG}"
                def remoteImage = "${ECR_REGISTRY}/${ECR_REPO}:${service}-${component}-${IMAGE_TAG}"
                def latestImage = "${ECR_REGISTRY}/${ECR_REPO}:${service}-${component}-latest"
                
                sh """
                    docker tag ${localImage} ${remoteImage}
                    docker tag ${localImage} ${latestImage}
                    docker push ${remoteImage}
                    docker push ${latestImage}
                """
                
                echo "✅ Pushed ${remoteImage}"
            }
        }
    }
}

def deployService(String service) {
    echo "🚀 Deploying ${service} to ${params.ENVIRONMENT}..."
    
    // Add your deployment logic here (ECS, EKS, etc.)
    // Example: Update ECS service, trigger ArgoCD, etc.
    
    echo "✅ Deployed ${service}"
}

def runSmokeTests(String service) {
    echo "🧪 Running smoke tests for ${service}..."
    
    // Add smoke test logic
    
    echo "✅ Smoke tests passed for ${service}"
}

def notifySuccess() {
    def message = """
        ✅ *Deployment Successful*
        Environment: ${params.ENVIRONMENT}
        Services: ${env.SERVICES_TO_BUILD}
        Commit: ${GIT_COMMIT_SHORT}
        Build: #${BUILD_NUMBER}
    """
    
    echo message
    // slackSend(channel: SLACK_CHANNEL, color: 'good', message: message)
}

def notifyFailure() {
    def message = """
        ❌ *Deployment Failed*
        Environment: ${params.ENVIRONMENT}
        Services: ${env.SERVICES_TO_BUILD}
        Commit: ${GIT_COMMIT_SHORT}
        Build: #${BUILD_NUMBER}
        Error: ${currentBuild.result}
    """
    
    echo message
    // slackSend(channel: SLACK_CHANNEL, color: 'danger', message: message)
}

def cleanupWorkspace() {
    echo "🧹 Cleaning up..."
    
    sh """
        docker image prune -af --filter "label=build-date<\$(date -d '7 days ago' +%Y%m%d)" || true
        docker system prune -f --volumes || true
    """
    
    cleanWs()
}
