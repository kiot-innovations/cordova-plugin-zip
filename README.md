# Onboarding Requirements

1. Give your Github username to Alvin Cheung so he can give you access to the energylink-connect2 and pvsmgmt-console repository.
2. Give your iOS account email and your full name (first name & last name) to Alvin Cheung so you can get the app via TestFlight on your iPhone that you want to test with if you have one.
3. Send Rick Mellor your NPM account username and email address so he can add you to our shared NPM repositories
4. Ask Rick Mellor for acccess to "CM2 JIRA"
5. Read the rest of this README.md and get yourself set up
6. See https://www.figma.com/file/KAPvdJ5ogFEVCw2zTFjgS6/EnergyLink-Connect-2?node-id=171%3A0 for a visual representation of what still needs to be done, this is our "Figma Doc"

# Quickstart

# Set up your terminal

Add this to your .bashrc, .zshrc, etc.
Get the password string from a developer

```
export CM2_ENVFILE_PASSWORD="${GET_THIS_PASSWORD_FROM_ANY_DEVELOPER}"
```

## Install all dependencies:

```
cd ~/sunpower/energylink-connect2;
nvm install 10.15.3
nvm use
npm login;
npm i;
npm rebuild node-sass
cd ~/sunpower/energylink-connect2/energylink-connect2-app;
echo "SKIP_PREFLIGHT_CHECK=true" > .env

npm install -g cordova@9.0.0
npm install -g phonegap@9.0.0

cd ~/sunpower;
git clone git@github.com:SunPower/pvsmgmt-console.git;
cd ~/sunpower/pvsmgmt-console/pvsServer;
nvm use;
npm i;
```

Test and build native application:

```
cd ~/sunpower/energylink-connect2/energylink-connect2-app;
npm install;
npm run test;
npm run build;
```

Build iOS and android app for development

```
cd ~/sunpower/energylink-connect2/energylink-connect2-app;
phonegap platform add android;
phonegap platform add ios;
npm run dev:android;
npm run dev:ios;
```

# Run in iOS simulator

```
cd ~/sunpower/energylink-connect2/;
nvm use;
cordova emulate ios;
```

# Run local PVS Simulator

```
cd ~/sunpower/pvsmgmt-console/pvsServer;
nvm use;
grunt;
```

# How to release a new version

1. Set `version` and `ios-CFBundleVersion` in [config.xml](config.xml)
2. Commit your changes, create and push your tag

```
git commit -m 'Release: X.Y.Z`
git tag X.Y.Z
git push origin X.Y.Z
```

3. Github Actions will build and release a new version (X.Y.Z) of the application

# Login Credentials

## Partner Account

- username: test.createuser7@gmail.com
- password: Sunshine12

## Partner Pro

- Has access to EDP_API
- Has One Site Assocciated
- username: spwr_dev_partner_pro@outlook.com
- password: ThisisIt01

# Example of how to decrypt the env files

Get the password for doing this from anyone on the dev team

```
cd ~/sunpower/energylink-connect2/energylink-connect2-app;
openssl aes-256-cbc -d -a -salt -in .env.enc.test -out .env.production;
cp .env.production .env.local;
cp .env.production .env.development;
```

# How to add a new development certificate

You'd want to do this if you're adding a new flavor of the application

## Set up the Apple & Google stores

Apple:

1. https://developer.apple.com/account/resources/identifiers/list (create a new identifier)
2. https://appstoreconnect.apple.com/ (create a new app with the identifier from the previous step, this is the "Bundle ID")
   Google:
3. https://play.google.com/apps/publish (create a new app with the same "Bundle ID" from the Apple steps above)
4. Build the app with the same bundle id from the apple app
5. https://play.google.com/apps/publish (push your app through to a closed beta state)

## Run this

```
brew install fastlane;
fastlane match appstore;
```

## It'll ask you for the following information:

_github url to the fast lane certificates:_ git@github.com:SunPower/firmware-mobile-certificates.git
_username:_ developer_support@sunpowercorp.com
_password:_ ask Alvin, Chris, or Kamil for this password
_Bundle IDs:_ com.sunpower.energylink.commissioning2.test,com.sunpower.energylink.commissioning2.prod,com.sunpower.energylink.commissioning2.training,com.sunpower.energylink.commissioning2

Modify the bundle IDs to be whatever you need them to be, then update this readme with the latest app ids
