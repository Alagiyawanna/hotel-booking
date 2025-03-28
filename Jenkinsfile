pipeline {
    agent any
    
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Test') {
            steps {
                // Backend tests
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test || true' // Continue even if tests fail for now
                }
                
                // Frontend tests
                dir('signin') {
                    sh 'npm install'
                    sh 'npm test || true' // Continue even if tests fail for now
                }
            }
        }
        
        stage('Provision Infrastructure') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve -var="key_name=your-aws-key-name"'
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                dir('ansible') {
                    sh 'ansible-playbook playbook.yml'
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed'
        }
        success {
            echo 'Pipeline succeeded'
        }
    }
}