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

## Decrypt the env files

Get the password for doing this from anyone on the dev team

```
cd ~/sunpower/energylink-connect2/energylink-connect2-app;

# You need these for building locally
openssl aes-256-cbc -d -a -salt -in .env.enc.test -out .env.develop;
openssl aes-256-cbc -d -a -salt -in .env.enc.test -out .env.production;

# You probably don't need these locally
openssl aes-256-cbc -d -a -salt -in .env.enc.prod -out .env.prod;
openssl aes-256-cbc -d -a -salt -in .env.enc.test -out .env.test;
openssl aes-256-cbc -d -a -salt -in .env.enc.training -out .env.training;
openssl aes-256-cbc -d -a -salt -in .env.enc.uat -out .env.uat;

```

## Encrypt the env files

```
cd ~/sunpower/energylink-connect2/energylink-connect2-app;

openssl aes-256-cbc -e -a -salt -in .env.prod -out .env.enc.prod;
openssl aes-256-cbc -e -a -salt -in .env.test -out .env.enc.test;
openssl aes-256-cbc -e -a -salt -in .env.training -out .env.enc.training;
openssl aes-256-cbc -e -a -salt -in .env.uat -out .env.enc.uat;
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
```

Test and build native application:

```

cd ~/sunpower/energylink-connect2/energylink-connect2-app;
npm install;
npm run test;
npm run build;

```

Build Android for development

```
cd ~/sunpower/energylink-connect2/
cordova platform add android;
cordova prepare android;
cordova run android;
```

Build iOS for development

```

cd ~/sunpower/energylink-connect2/
cordova platform add ios;
cordova prepare ios;
```

# For iOS only

```
cd ~/sunpower/energylink-connect2;
rm -rf platforms plugins node_modules;
cd ~/sunpower/energylink-connect2/energylink-connect2-app;
rm -rf node_modules && npm i;
cordova platform add ios;
npm run build && cordova prepare ios;
```

# Use this if you want live reload

```
npm run dev:ios; cordova prepare ios;
```

# You only have to do this once (deprecated)

> For the time being, we don't need to do this anymore, since we're using a fixed version
> of Scandit, which doesn't require pod installations.

```
cd platforms/ios;
pod repo update;
pod update;
```

## Open Xcode

> You need Xcode installed in your machine in order to continue with the next steps

```
 open ~/sunpower/energylink-connect2/platforms/ios/SunPowerProConnect-dev.xcworkspace/
```

## Add your team's certificate

1. Select your project (it says SunpowerProConnect-dev on the sidebar)
2. Find the [Signing & Capabilities] tab
3. Uncheck any Automatically Sign checkboxes
4. Re-check the Automatically Sign checkboxes
5. Select your team "Sunpower..."

## Change your build settings to validate your workspace

1. Find the [Build Settings] tab
2. Search for "Validate Workspace" in the search input
3. Select [Yes]

## Run the app on your iPhone

1. Connect your iPhone to the Mac
2. On Xcode, select your iPhone from the devices list (located at the top center in Xcode)
3. Hit the Run button (it's a triangle icon)

## Run in iOS simulator

> Note: The app has limited functionality on a simulator; you should use a real device instead

```
cd ~/sunpower/energylink-connect2/;
nvm use;
cordova emulate ios;
```

# How to release a new version

## Happy Path

1. Set `version` and `ios-CFBundleVersion` in [config.xml](config.xml)
2. Commit your changes, create and push your tag

```
git checkout -b release/X.Y.Z
git add .
git commit -m '[Release Notes CM2 Ticket Number] Release X.Y.Z`
git push origin
git tag X.Y.Z
git push origin X.Y.Z
```

## Targeting specific flavors for build

> Note: There is a script that automates this: `release.sh`

```
git tag X.Y.Z-${flavor}
git push origin X.Y.Z-${flavor}
```

where ${flavor} can be any of ['prod', 'uat', 'test']

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

# How to update the FASTLANE_SESSION when the CI fails because Apple needs a new sesssion

## Run this in terminal

```
fastlane spaceauth -u developer_support@sunpowercorp.com
```

Get the code from Alvin's phone, type it in the terminal input

## Put the output here

https://github.com/SunPower/energylink-connect2/settings/secrets/actions/FASTLANE_SESSION
Hit save and rerun the build that just failed

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

_github url to the fast lane certificates:_ git@github.com:sunpower/firmware-mobile-certificates.git
_username:_ developer_support@sunpowercorp.com
_password:_ ask Alvin or Fer for this password
_Bundle IDs:_ com.sunpower.energylink.commissioning2.test,com.sunpower.energylink.commissioning2.prod,com.sunpower.energylink.commissioning2.training,com.sunpower.energylink.commissioning2

Modify the bundle IDs to be whatever you need them to be, then update this readme with the latest app ids

# Upgrading/Downgrading the PVS Firmware Version via USB

1. Go to the Slack channel `fw-builds` and find the notification for the version you need.
2. Search for the `LUA USB file` `Open` link and click on it to download a ZIP file.
3. Copy that ZIP file to a blank USB drive.
4. Once in the USB drive, unzip the ZIP file and delete the ZIP file.
5. Turn off the PVS and plug the USB drive on any PVS' USB port.
6. Turn on the PVS and wait for around 10 minutes for the process to complete.
7. Turn off the PVS and remove the USB drive.
8. Turn on the PVS, wait for it to boot. It should be now using the downgraded/upgraded PVS FW version.
9. You may need to repeat this process using different FW versions until the PVS works properly.
