#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

function urlencode() {
    local LC_COLLATE=C
    local length="${#1}"

    for (( i = 0; i < length; i++ )); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) echo -n "${c}" ;;
            *) printf '%%%02X' "'${c}" ;;
        esac
    done
}

function validate_env() {
    local variable=${1}

    if ! env | grep -q "${variable}"; then
        echo "ERROR: Environment Variable '${variable}' is not set"
        exit 1
    fi
}

validate_env BRANCH_NAME
validate_env BUILD_ID
validate_env JENKINS_URL
validate_env PROJECT_NAME
validate_env SLACK_WEBHOOK_URL

readonly slack_channel="cm2-dev"
readonly build_url="${JENKINS_URL}/blue/organizations/jenkins/$PROJECT_NAME/detail/$(urlencode "${BRANCH_NAME}")/$BUILD_ID"


readonly slack_message_payload=$(cat <<_HEREDOC_
{
    "attachments": [
        {
            "color": "good",
            "fields": [
                {
                    "title": "Revision",
                    "value": "$BRANCH_NAME",
                    "short": true
                },
                {
                    "title": "Build ID",
                    "value": "$BUILD_ID",
                    "short": true
                }
            ]
        }
    ],
    "channel": "$slack_channel",
    "text": "New release is available. <$build_url/pipeline|Click here> for more details.",
	"username": "Jenkins"
}
_HEREDOC_
)

curl -X POST --data-urlencode "payload=${slack_message_payload}" "${SLACK_WEBHOOK_URL}"
