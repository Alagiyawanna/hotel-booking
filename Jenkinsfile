pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKER_IMAGE_BACKEND = "yourdockerhubusername/staysphere-backend:${BUILD_NUMBER}"
        DOCKER_IMAGE_FRONTEND = "yourdockerhubusername/staysphere-frontend:${BUILD_NUMBER}"
        DOCKER_IMAGE_BACKEND_LATEST = "yourdockerhubusername/staysphere-backend:latest"
        DOCKER_IMAGE_FRONTEND_LATEST = "yourdockerhubusername/staysphere-frontend:latest"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        
        stage('Login to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                echo 'Login Successful'
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${DOCKER_IMAGE_BACKEND} -t ${DOCKER_IMAGE_BACKEND_LATEST} ."
                            echo 'Backend Image Build Successful'
                        }
                    }
                }
                
                stage('Build Frontend Image') {
                    steps {
                        dir('signin') {
                            sh "docker build -t ${DOCKER_IMAGE_FRONTEND} -t ${DOCKER_IMAGE_FRONTEND_LATEST} ."
                            echo 'Frontend Image Build Successful'
                        }
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                sh "docker push ${DOCKER_IMAGE_BACKEND}"
                sh "docker push ${DOCKER_IMAGE_BACKEND_LATEST}"
                sh "docker push ${DOCKER_IMAGE_FRONTEND}"
                sh "docker push ${DOCKER_IMAGE_FRONTEND_LATEST}"
                echo 'All Images Pushed Successfully'
            }
        }
        
        stage('Clean Up') {
            steps {
                sh "docker rmi ${DOCKER_IMAGE_BACKEND}"
                sh "docker rmi ${DOCKER_IMAGE_BACKEND_LATEST}"
                sh "docker rmi ${DOCKER_IMAGE_FRONTEND}"
                sh "docker rmi ${DOCKER_IMAGE_FRONTEND_LATEST}"
                echo 'Local images removed'
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
        failure {
            echo 'Pipeline failed'
        }
        success {
            echo 'Pipeline succeeded'
        }
    }
}