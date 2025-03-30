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
                        # Create a temporary directory in the Jenkins workspace
                        TEMP_DIR="${WORKSPACE}/ansible-deploy-temp"
                        mkdir -p "${TEMP_DIR}"
                        
                        # Copy the SSH key to the temporary directory with proper permissions
                        cp "$SSH_KEY_FILE" "${TEMP_DIR}/hotel-booking.pem"
                        chmod 600 "${TEMP_DIR}/hotel-booking.pem"
                        
                        # Set Docker Hub credentials
                        export DOCKERHUB_USERNAME=$DOCKERHUB_CREDENTIALS_USR
                        export DOCKERHUB_PASSWORD=$DOCKERHUB_CREDENTIALS_PSW
                        
                        # For debugging SSH connections
                        export ANSIBLE_HOST_KEY_CHECKING=False
                        
                        # Get the instance DNS from terraform output
                        cd terraform
                        INSTANCE_DNS=$(terraform output -raw instance_public_dns)
                        cd ..
                        
                        echo "Attempting to connect to EC2 instance at $INSTANCE_DNS"
                        
                        # Test SSH connection
                        ssh -o StrictHostKeyChecking=no -i "${TEMP_DIR}/hotel-booking.pem" -T ubuntu@$INSTANCE_DNS "echo SSH connection successful" || {
                            echo "Failed to connect to EC2 instance via SSH. Verifying SSH key and security group settings."
                            exit 1
                        }
                        
                        # Run Ansible playbook with the correct inventory
                        cd ansible
                        echo "[ec2_instances]" > temp_inventory.ini
                        echo "hotel-booking ansible_host=$INSTANCE_DNS ansible_user=ubuntu" >> temp_inventory.ini
                        
                        ansible-playbook -i temp_inventory.ini playbook.yml -v --private-key="${TEMP_DIR}/hotel-booking.pem"
                        
                        # Clean up
                        rm -f temp_inventory.ini
                        rm -f "${TEMP_DIR}/hotel-booking.pem"
                        rmdir "${TEMP_DIR}"
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