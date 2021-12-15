const { execSync } = require('child_process');

if (!process.env.CI) {
  const packagejson = "sed -i '' 's#git+https://github.com/Viras-/cordova-plugin-powermanagement.git#^1.1.2#g' package.json"
  execSync(packagejson);
  execSync('git restore package-lock.json');
}
