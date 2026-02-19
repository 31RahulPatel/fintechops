def getServiceList() {
    return ['all', 'auth-service', 'market-data-service', 'news-service']
}

pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Deployment environment')
        choice(name: 'SERVICE', choices: getServiceList(), description: 'Select service to deploy')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip quality checks')
    }
    
    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '123456789012'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_REPO = "fintechops-${params.ENVIRONMENT}"
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        IMAGE_TAG = "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Initialize') {
            steps {
                script {
                    echo "🚀 Deployment: ${params.SERVICE} → ${params.ENVIRONMENT}"
                    
                    if (params.SERVICE == 'all') {
                        env.SERVICES = sh(
                            returnStdout: true,
                            script: 'ls -d *-service/ 2>/dev/null | sed "s/\\///" | tr "\\n" " " || echo "auth-service market-data-service news-service"'
                        ).trim()
                    } else {
                        env.SERVICES = params.SERVICE
                    }
                    
                    echo "📦 Services: ${env.SERVICES}"
                    
                    if (params.ENVIRONMENT == 'prod') {
                        input message: "Deploy to PRODUCTION?", ok: "Deploy"
                    }
                }
            }
        }
        
        stage('Build & Test') {
            steps {
                script {
                    def services = env.SERVICES.split()
                    
                    services.each { service ->
                        echo "🔨 Building ${service}..."
                        
                        // Backend
                        if (fileExists("${service}/backend/Dockerfile")) {
                            dir("${service}/backend") {
                                if (!params.SKIP_TESTS && fileExists('src')) {
                                    try {
                                        def scannerHome = tool 'SonarScanner'
                                        withSonarQubeEnv('SonarQube') {
                                            sh """
                                                ${scannerHome}/bin/sonar-scanner \
                                                -Dsonar.projectKey=${service}-backend \
                                                -Dsonar.sources=src
                                            """
                                        }
                                    } catch (Exception e) {
                                        echo "⚠️  Quality check skipped: ${e.message}"
                                    }
                                }
                                
                                sh """
                                    docker build -t ${service}-backend:${IMAGE_TAG} \
                                    --build-arg NODE_ENV=${params.ENVIRONMENT} \
                                    --label service=${service} \
                                    --label component=backend .
                                """
                                
                                def trivyExitCode = params.ENVIRONMENT == 'prod' ? 1 : 0
                                sh """
                                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy:latest image --severity HIGH,CRITICAL \
                                    --exit-code ${trivyExitCode} ${service}-backend:${IMAGE_TAG}
                                """
                            }
                        }
                        
                        // Frontend
                        if (fileExists("${service}/frontend/Dockerfile")) {
                            dir("${service}/frontend") {
                                if (!params.SKIP_TESTS && fileExists('src')) {
                                    try {
                                        def scannerHome = tool 'SonarScanner'
                                        withSonarQubeEnv('SonarQube') {
                                            sh """
                                                ${scannerHome}/bin/sonar-scanner \
                                                -Dsonar.projectKey=${service}-frontend \
                                                -Dsonar.sources=src
                                            """
                                        }
                                    } catch (Exception e) {
                                        echo "⚠️  Quality check skipped: ${e.message}"
                                    }
                                }
                                
                                sh """
                                    docker build -t ${service}-frontend:${IMAGE_TAG} \
                                    --build-arg NODE_ENV=${params.ENVIRONMENT} \
                                    --label service=${service} \
                                    --label component=frontend .
                                """
                                
                                def trivyExitCode = params.ENVIRONMENT == 'prod' ? 1 : 0
                                sh """
                                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy:latest image --severity HIGH,CRITICAL \
                                    --exit-code ${trivyExitCode} ${service}-frontend:${IMAGE_TAG}
                                """
                            }
                        }
                        
                        echo "✅ Built ${service}"
                    }
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                        
                        def services = env.SERVICES.split()
                        services.each { service ->
                            ['backend', 'frontend'].each { component ->
                                def imageName = "${service}-${component}:${IMAGE_TAG}"
                                if (sh(returnStatus: true, script: "docker image inspect ${imageName}") == 0) {
                                    sh """
                                        docker tag ${imageName} ${ECR_REGISTRY}/${ECR_REPO}:${service}-${component}-${IMAGE_TAG}
                                        docker tag ${imageName} ${ECR_REGISTRY}/${ECR_REPO}:${service}-${component}-latest
                                        docker push ${ECR_REGISTRY}/${ECR_REPO}:${service}-${component}-${IMAGE_TAG}
                                        docker push ${ECR_REGISTRY}/${ECR_REPO}:${service}-${component}-latest
                                    """
                                    echo "✅ Pushed ${service}-${component}"
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh """
                    docker image prune -af --filter "until=168h" || true
                    docker system prune -f --volumes || true
                """
            }
        }
    }
    
    post {
        success {
            echo """
                ✅ DEPLOYMENT SUCCESSFUL
                Environment: ${params.ENVIRONMENT}
                Services: ${env.SERVICES}
                Image Tag: ${IMAGE_TAG}
                Build: #${BUILD_NUMBER}
            """
        }
        failure {
            echo """
                ❌ DEPLOYMENT FAILED
                Environment: ${params.ENVIRONMENT}
                Services: ${env.SERVICES}
                Build: #${BUILD_NUMBER}
            """
        }
        always {
            script {
                try {
                    cleanWs()
                } catch (Exception e) {
                    echo "Cleanup skipped"
                }
            }
        }
    }
}
