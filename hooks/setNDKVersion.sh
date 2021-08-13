#!/usr/bin/env bash
OS=$(uname)
if [ $OS = "Darwin" ]; then
    sed -i"" -E 's/android {/android {\n ndkVersion "21.4.7075529"/' platforms/android/app/build.gradle
else
    sed -i"" -E 's/android \{/android \{\n ndkVersion "21.4.7075529"/' platforms/android/app/build.gradle
fi
