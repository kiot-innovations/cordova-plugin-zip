#!/usr/bin/env bash
OS=$(uname)
nl=$'\n'
if [ $OS = "Darwin" ]; then
    sed -i'' -E "s#   ndkVersion \"21.4.7075529\"##" platforms/android/app/build.gradle
    sed -i'' -E "s#android {#android {\\${nl}   ndkVersion \"21.4.7075529\"#" platforms/android/app/build.gradle
else
    sed -i'' -E "s#android \{#android \{\n ndkVersion \"21.4.7075529\"#" platforms/android/app/build.gradle
fi
