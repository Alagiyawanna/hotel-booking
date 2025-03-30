pipeline {
    agent any
    
    // environment {
    //     AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
    //     AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    //     TF_IN_AUTOMATION = 'true'
    // }
    
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
        
        // stage('Provision Infrastructure') {
        //     steps {
        //         dir('terraform') {
        //             sh 'terraform init'
        //             sh 'terraform apply -auto-approve -var="key_name=your-aws-key-name"'
        //         }
        //     }
        // }
        
        // stage('Deploy Application') {
        //     steps {
        //         dir('ansible') {
        //             sh 'ansible-playbook playbook.yml'
        //         }
        //     }
        // }
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