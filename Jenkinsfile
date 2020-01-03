pipeline {
    agent {
        node { label "capability.xcode" }
    }

    environment {
        NVM_VERSION         = "10.15.3"
        RUBY_VERSION        = "2.3.0"

        ANDROID_HOME        = "/usr/local/android-sdk-linux/tools"
        FASTLANE_PASSWORD   = credentials('pvs6-match-password')
        LC_ALL              = "en_US.UTF-8"
        MATCH_PASSWORD      = credentials('pvs6-match-password')
        KEYCHAIN_PASSWORD   = credentials('pvs6-macos-keychain-password')
        KEYSTORE_ALIAS      = "key0"
        KEYSTORE_PATH       = credentials('google-play-upload-keystore-energylink-mobilecommissioning')
        KEYSTORE_PASSWORD   = credentials('google-play-upload-keystore-password-energylink-mobilecommissioning')
        NVM_CMD_FLAGS       = ""
        NVM_BIN             = "NVM_BIN=/Users/admin/.nvm/versions/node/v${NVM_VERSION}/bin"
        NVM_DIR             = "/Users/admin/.nvm"
        PATH                = "/Users/admin/.gem/ruby/${RUBY_VERSION}/bin:/Users/admin/.nvm/versions/node/v${NVM_VERSION}/bin:/usr/local/android-sdk-linux/platform-tools:${PATH}"
        PLAY_STORE_API_CRED = credentials("google-play-store-api-credentials-json")
        PROJECT_NAME        = "${env.JOB_NAME.split('/')[0]}"
        SLACK_WEBHOOK_URL   = credentials('slack-webhook-url')

        ENVFILE_PASSWORD    = credentials('energylink-connect2-envfile-password')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    stages {
        stage('setup') {
            steps {
                sh "env | sort"
                sh "npm install"
                sh "npm rebuild node-sass"
                sh "bundle install --deployment"
                sh "security unlock -p ${KEYCHAIN_PASSWORD} ~/Library/Keychains/login.keychain;"
            }
        }

        stage('native-app') {
            steps {
                sh "cd energylink-connect2-app && npm install"
                sh "cd energylink-connect2-app && CI=1 npm run test"

                sh "openssl aes-256-cbc -d -a -salt -k '${ENVFILE_PASSWORD}' -in energylink-connect2-app/.env.enc -out energylink-connect2-app/.env"
                sh "cd energylink-connect2-app && npm run build"
            }
        }

        stage('android') {
            steps {
                sh "npx phonegap prepare android"
                sh "bundle exec fastlane android build"
            }
        }

        stage('ios') {
            steps {
                sh "npx phonegap prepare ios"
                sh "bundle exec fastlane ios build"
            }
        }

        stage('release') {
            when {
                // Release only for git tags in format X.Y.Z
                tag pattern: "^\\d+\\.\\d+\\.\\d+\$", comparator: "REGEXP"
            }
            steps {
                sh "bundle exec fastlane android release"
                sh "bundle exec fastlane ios release"
            }
            post {
                success {
                    sh "./devops/slack_notification.sh"
                }
            }
        }
    }

    post {
        always {
            sh "rm -rf platforms"
            sh "rm .env"
        }
    }
}
