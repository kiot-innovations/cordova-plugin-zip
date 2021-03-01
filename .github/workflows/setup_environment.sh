#!/usr/bin/env bash

if [[ -z "${APP_ENV}" ]]; then
    echo "APP_ENV is not set"
    exit 1
fi

set -o errexit
set -o pipefail

ROOT_DIR="${0%/*}/../.."

#
# We use fastlane to upload to the play store
# Find other options for "RELEASE_TRACK" here: https://docs.fastlane.tools/actions/upload_to_play_store/
#

case "${APP_ENV}" in
    prod)
        readonly APP_ID="com.sunpower.energylink.commissioning2"
        readonly APP_NAME="SunPowerProConnect"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="internal"
        ;;

    test)
        readonly APP_ID="com.sunpower.energylink.commissioning2.test"
        readonly APP_NAME="SunPowerProConnect-test"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="internal"
        ;;

    training)
        readonly APP_ID="com.sunpower.energylink.commissioning2.training"
        readonly APP_NAME="SunPowerProConnect-training"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="internal"
        ;;

    uat)
        readonly APP_ID="com.sunpower.energylink.commissioning2.prod"
        readonly APP_NAME="SunPowerProConnect-beta"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="internal"
        ;;

    *)
        echo "Unsupported application environment ${APP_ENV}"
        echo "Allowed values: uat, prod, test, training"
        exit 1
        ;;
esac

if [[ "${BUILD_TYPE}" == "release" ]]; then
    readonly CORDOVA_RELEASE=true
else
    readonly CORDOVA_RELEASE=false
fi

readonly CORDOVA_ANDROID_RELEASE_BUILD_PATH="./platforms/android/app/build/outputs/apk/${BUILD_TYPE}/app-${BUILD_TYPE}.apk"
readonly CORDOVA_IOS_RELEASE_BUILD_PATH="./platforms/ios/build/device/${APP_NAME}.ipa"
readonly JAVA_VERSION="$(cat "${ROOT_DIR}/.java-version")"
readonly NODE_VERSION="$(cat "${ROOT_DIR}/.nvmrc")"
readonly RUBY_VERSION="$(cat "${ROOT_DIR}/.ruby-version")"

#
# Set variables in GitHub Action Job
# https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#setting-an-environment-variable
#
echo "APP_ID=${APP_ID}" >> $GITHUB_ENV
echo "APP_NAME=${APP_NAME}" >> $GITHUB_ENV
echo "BUILD_TYPE=${BUILD_TYPE}" >> $GITHUB_ENV
echo "CORDOVA_ANDROID_RELEASE_BUILD_PATH=${CORDOVA_ANDROID_RELEASE_BUILD_PATH}" >> $GITHUB_ENV
echo "CORDOVA_IOS_RELEASE_BUILD_PATH=${CORDOVA_IOS_RELEASE_BUILD_PATH}" >> $GITHUB_ENV
echo "CORDOVA_RELEASE=${CORDOVA_RELEASE}" >> $GITHUB_ENV
echo "JAVA_VERSION=${JAVA_VERSION}" >> $GITHUB_ENV
echo "NODE_VERSION=${NODE_VERSION}" >> $GITHUB_ENV
echo "RUBY_VERSION=${RUBY_VERSION}" >> $GITHUB_ENV
echo "RELEASE_TRACK=${RELEASE_TRACK}" >> $GITHUB_ENV
