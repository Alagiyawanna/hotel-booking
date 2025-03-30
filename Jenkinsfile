pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        AWS_CREDENTIALS = credentials('aws-credentials')
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
        
        stage('Build Images') {
            steps {
                sh 'docker build -t kalagiyawanna/staysphere-backend:latest ./backend'
                sh 'docker build -t kalagiyawanna/staysphere-signin:latest ./signin'
            }
        }
        
        stage('Push Images') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push kalagiyawanna/staysphere-backend:latest'
                sh 'docker push kalagiyawanna/staysphere-signin:latest'
            }
        }
        
        stage('Terraform Init') {
            steps {
                sh '''
                    cd terraform
                    terraform init
                '''
            }
        }
        
        stage('Terraform Plan') {
            steps {
                sh '''
                    cd terraform
                    export AWS_ACCESS_KEY_ID=$AWS_CREDENTIALS_USR
                    export AWS_SECRET_ACCESS_KEY=$AWS_CREDENTIALS_PSW
                    terraform plan -out=tfplan
                '''
            }
        }

        stage('Terraform Apply') {
            steps {
                sh '''
                    cd terraform
                    export AWS_ACCESS_KEY_ID=$AWS_CREDENTIALS_USR
                    export AWS_SECRET_ACCESS_KEY=$AWS_CREDENTIALS_PSW
                    terraform apply -auto-approve tfplan
                '''
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    file(credentialsId: 'ec2-ssh-key-file', variable: 'SSH_KEY_FILE')
                ]) {
                    sh '''
                        cd ansible
                        
                        # Copy the SSH key to the working directory with proper permissions
                        cp $SSH_KEY_FILE hotel-booking.pem
                        chmod 400 hotel-booking.pem
                        
                        # Set Docker Hub credentials
                        export DOCKERHUB_USERNAME=$DOCKERHUB_CREDENTIALS_USR
                        export DOCKERHUB_PASSWORD=$DOCKERHUB_CREDENTIALS_PSW
                        
                        # For debugging SSH connections
                        export ANSIBLE_HOST_KEY_CHECKING=False
                        
                        # Run Ansible playbook
                        ansible-playbook -i inventory.ini playbook.yml -v
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}