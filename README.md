# Quickstart
```bash
nvm install 10.15.3;
nvm use 10.15.3;
npm rebuild node-sass;
cd ~/sunpower/energylink-connect2/energylink-connect2-app;
npm i;
npm run build;
cd ~/sunpower/energylink-connect2/
npm i;
phongap init ios;
phonegap init android;
phonegap prepare ios;
phonegap prepare android;
```

## Run in iOS simulator
```bash
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
