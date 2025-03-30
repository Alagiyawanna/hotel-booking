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
                    
                    # Get the public IP address from Terraform output
                    PUBLIC_IP=$(terraform output -raw instance_public_ip)
                    echo "EC2 Instance Public IP: $PUBLIC_IP"
                    
                    # Create a dynamic inventory for Ansible
                    echo "[ec2_instances]" > ../ansible/inventory.ini
                    echo "hotel-booking ansible_host=$PUBLIC_IP ansible_user=ubuntu" >> ../ansible/inventory.ini
                    
                    cat ../ansible/inventory.ini
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
                        
                        # Run Ansible playbook from the workspace but using the key in the temporary location
                        cd ansible
                        ansible-playbook -i inventory.ini playbook.yml -v --private-key="${TEMP_DIR}/hotel-booking.pem"
                        
                        # Clean up
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
            
            sh '''
                cd terraform
                export AWS_ACCESS_KEY_ID=$AWS_CREDENTIALS_USR
                export AWS_SECRET_ACCESS_KEY=$AWS_CREDENTIALS_PSW
                
                # Output the application URL for easy access
                PUBLIC_IP=$(terraform output -raw instance_public_ip)
                echo "========================================================"
                echo "Application is deployed successfully!"
                echo "Frontend URL: http://$PUBLIC_IP:3000"
                echo "Backend API URL: http://$PUBLIC_IP:5000"
                echo "========================================================"
            '''
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}