const { execSync } = require('child_process');
execSync('sed -i"" -E \'s/android \\{/android \\{\\n ndkVersion "21.4.7075529"/\' platforms/android/app/build.gradle\n');

