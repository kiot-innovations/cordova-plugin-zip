# Quickstart

Install all dependencies:

```
nvm install 10.15.3
nvm use 10.15.3
npm rebuild node-sass

npm install -g cordova@9.0.0
npm install -g phonegap@9.0.0
```

Login to npm (we use private npm repositories):

```
npm login
```

Test and build native application:

```
cd energylink-connect2-app
npm install
npm run test
npm run build
cd ..
```

Build iOS and android app

```
phonegap prepare ios
phonegap prepare android
```

## Run in iOS simulator

```
cd ~/sunpower/energylink-connect2/;
cordova emulate ios;
```

## How to release a new version

1. Set `version` and `ios-CFBundleVersion` in [config.xml](config.xml)
2. Commit your changes, create and push your tag

```
git add config.xml
git commit -m 'Release: X.Y.Z`
git tag X.Y.Z
git push origin X.Y.Z
```

3. Jenkins will build and release a new version (X.Y.Z) of the application
