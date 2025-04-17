pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        PM2_NAME = 'nuxt-app'
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm install -g pm2'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    # Stop existing PM2 process if running
                    pm2 stop ${PM2_NAME} || true
                    pm2 delete ${PM2_NAME} || true
                    
                    # Start the application with PM2
                    pm2 start npm --name "${PM2_NAME}" -- start
                    
                    # Save PM2 process list
                    pm2 save
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
} 