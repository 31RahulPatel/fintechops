pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'prod'], description: 'Select deployment environment')
        choice(name: 'SERVICE', choices: ['auth-service', 'payment-service', 'account-service', 'all'], description: 'Select service to deploy')
    }
    
    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_REPO = "fintechops-${params.ENVIRONMENT}"
        SERVICE_NAME = "${params.SERVICE}"
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
        SONAR_PROJECT_KEY = "fintechops-${params.SERVICE}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                }
            }
        }
        
        stage('SonarQube Analysis - Backend') {
            when {
                expression { params.SERVICE == 'auth-service' || params.SERVICE == 'all' }
            }
            steps {
                dir("${params.SERVICE}/backend") {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        withSonarQubeEnv('SonarQube') {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY}-backend \
                                -Dsonar.sources=src \
                                -Dsonar.javascript.node.maxspace=4096
                            """
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis - Frontend') {
            when {
                expression { params.SERVICE == 'auth-service' || params.SERVICE == 'all' }
            }
            steps {
                dir("${params.SERVICE}/frontend") {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        withSonarQubeEnv('SonarQube') {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY}-frontend \
                                -Dsonar.sources=src \
                                -Dsonar.javascript.node.maxspace=4096
                            """
                        }
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            when {
                expression { params.SERVICE == 'auth-service' || params.SERVICE == 'all' }
            }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        
        stage('Build Backend Image') {
            steps {
                dir("${params.SERVICE}/backend") {
                    script {
                        sh """
                            docker build -t ${SERVICE_NAME}-backend:${IMAGE_TAG} \
                            --build-arg NODE_ENV=${params.ENVIRONMENT} .
                        """
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            when {
                expression { params.SERVICE == 'auth-service' || params.SERVICE == 'all' }
            }
            steps {
                dir("${params.SERVICE}/frontend") {
                    script {
                        sh """
                            docker build -t ${SERVICE_NAME}-frontend:${IMAGE_TAG} \
                            --build-arg REACT_APP_ENV=${params.ENVIRONMENT} .
                        """
                    }
                }
            }
        }
        
        stage('Trivy Scan - Backend') {
            steps {
                script {
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy:latest image --severity HIGH,CRITICAL \
                        --exit-code 0 \
                        --no-progress \
                        ${SERVICE_NAME}-backend:${IMAGE_TAG}
                    """
                }
            }
        }
        
        stage('Trivy Scan - Frontend') {
            when {
                expression { params.SERVICE == 'auth-service' || params.SERVICE == 'all' }
            }
            steps {
                script {
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy:latest image --severity HIGH,CRITICAL \
                        --exit-code 0 \
                        --no-progress \
                        ${SERVICE_NAME}-frontend:${IMAGE_TAG}
                    """
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                        sh """
                            aws ecr get-login-password --region ${AWS_REGION} | \
                            docker login --username AWS --password-stdin ${ECR_REGISTRY}
                            
                            docker tag ${SERVICE_NAME}-backend:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-backend-${IMAGE_TAG}
                            docker tag ${SERVICE_NAME}-backend:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-backend-latest
                            docker push ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-backend-${IMAGE_TAG}
                            docker push ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-backend-latest
                        """
                        
                        if (params.SERVICE == 'auth-service' || params.SERVICE == 'all') {
                            sh """
                                docker tag ${SERVICE_NAME}-frontend:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-frontend-${IMAGE_TAG}
                                docker tag ${SERVICE_NAME}-frontend:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-frontend-latest
                                docker push ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-frontend-${IMAGE_TAG}
                                docker push ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-frontend-latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh """
                    docker rmi ${SERVICE_NAME}-backend:${IMAGE_TAG} || true
                    docker rmi ${SERVICE_NAME}-frontend:${IMAGE_TAG} || true
                    docker rmi ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-backend-${IMAGE_TAG} || true
                    docker rmi ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-frontend-${IMAGE_TAG} || true
                """
            }
        }
    }
    
    post {
        success {
            echo "Pipeline completed successfully for ${params.ENVIRONMENT} environment"
            echo "Backend Image: ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-backend-${IMAGE_TAG}"
            echo "Frontend Image: ${ECR_REGISTRY}/${ECR_REPO}:${SERVICE_NAME}-frontend-${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed for ${params.ENVIRONMENT} environment"
        }
        always {
            cleanWs()
        }
    }
}
