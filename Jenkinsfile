pipeline {
    agent any

    environment {
        SITE_URL              = credentials('site-url')
        MONGODB_STRING        = credentials('mongodb-string')
        NUXT_SESSION_SECRET   = credentials('nuxt-session-secret')
        NUXT_SESSION_PASSWORD = credentials('nuxt-session-password')
        CF_API_TOKEN          = credentials('cf-api-token')
        S3_ACCESS_KEY         = credentials('s3-access-key')
        S3_SECRET_KEY         = credentials('s3-secret-key')
        S3_ENDPOINT           = credentials('s3-endpoint')
        S3_BUCKET_NAME        = credentials('s3-bucket-name')
        S3_PUBLIC_ENDPOINT    = credentials('s3-public-endpoint')
        PM2_NAME              = 'my-nuxt-app'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh '''
                    export SITE_URL="$SITE_URL"
                    export MONGODB_STRING="$MONGODB_STRING"
                    export NUXT_SESSION_SECRET="$NUXT_SESSION_SECRET"
                    export NUXT_SESSION_PASSWORD="$NUXT_SESSION_PASSWORD"
                    export CF_API_TOKEN="$CF_API_TOKEN"
                    export S3_ACCESS_KEY="$S3_ACCESS_KEY"
                    export S3_SECRET_KEY="$S3_SECRET_KEY"
                    export S3_ENDPOINT="$S3_ENDPOINT"
                    export S3_BUCKET_NAME="$S3_BUCKET_NAME"
                    export S3_PUBLIC_ENDPOINT="$S3_PUBLIC_ENDPOINT"

                    npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    export SITE_URL="$SITE_URL"
                    export MONGODB_STRING="$MONGODB_STRING"
                    export NUXT_SESSION_SECRET="$NUXT_SESSION_SECRET"
                    export NUXT_SESSION_PASSWORD="$NUXT_SESSION_PASSWORD"
                    export CF_API_TOKEN="$CF_API_TOKEN"
                    export S3_ACCESS_KEY="$S3_ACCESS_KEY"
                    export S3_SECRET_KEY="$S3_SECRET_KEY"
                    export S3_ENDPOINT="$S3_ENDPOINT"
                    export S3_BUCKET_NAME="$S3_BUCKET_NAME"
                    export S3_PUBLIC_ENDPOINT="$S3_PUBLIC_ENDPOINT"

                    pm2 stop "${PM2_NAME}" || true
                    pm2 delete "${PM2_NAME}" || true
                    pm2 start node --name "${PM2_NAME}" -- .output/server/index.mjs
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
