#!/usr/bin/env bash

if [[ -z "${APP_ENV}" ]]; then
    echo "APP_ENV is not set"
    exit 1
fi

set -o errexit
set -o pipefail

ROOT_DIR="${0%/*}/../.."

case "${APP_ENV}" in
    dev)
        readonly APP_ID="com.sunpower.energylink.commissioning2.dev"
        readonly APP_NAME="SunPowerProConnect-dev"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="beta"
        ;;

    prod)
        readonly APP_ID="com.sunpower.energylink.commissioning2"
        readonly APP_NAME="SunPowerProConnect"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="alpha"
        ;;

    test)
        readonly APP_ID="com.sunpower.energylink.commissioning2.test"
        readonly APP_NAME="SunPowerProConnect-test"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="alpha"
        ;;

    training)
        readonly APP_ID="com.sunpower.energylink.commissioning2.training"
        readonly APP_NAME="SunPowerProConnect-training"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="alpha"
        ;;

    testprod)
        readonly APP_ID="com.sunpower.energylink.commissioning2.prod"
        readonly APP_NAME="SunPowerProConnect-testprod"
        readonly BUILD_TYPE="${BUILD_TYPE:-release}"
        readonly RELEASE_TRACK="alpha"
        ;;

    *)
        echo "Unsupported application environment ${APP_ENV}"
        echo "Allowed values: dev, prod, test, training, testprod"
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
# https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions
#
echo "::set-env name=APP_ID::${APP_ID}"
echo "::set-env name=APP_NAME::${APP_NAME}"
echo "::set-env name=BUILD_TYPE::${BUILD_TYPE}"
echo "::set-env name=CORDOVA_ANDROID_RELEASE_BUILD_PATH::${CORDOVA_ANDROID_RELEASE_BUILD_PATH}"
echo "::set-env name=CORDOVA_IOS_RELEASE_BUILD_PATH::${CORDOVA_IOS_RELEASE_BUILD_PATH}"
echo "::set-env name=CORDOVA_RELEASE::${CORDOVA_RELEASE}"
echo "::set-env name=JAVA_VERSION::${JAVA_VERSION}"
echo "::set-env name=NODE_VERSION::${NODE_VERSION}"
echo "::set-env name=RUBY_VERSION::${RUBY_VERSION}"
echo "::set-env name=RELEASE_TRACK::${RELEASE_TRACK}"
