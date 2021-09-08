## Installation

```bash
npm i
```


## How to manage our encrypted keys

First of all, to decrypt the file, you need to run the command.
`openssl enc -aes256 -d -base64 -md md5 -pass -in .env.enc.dev -out .env.dev`
using the password that was given to you.

if you need to update the encrypted file, you will need to encrypt the file again with the command
`openssl enc -aes256 -base64 -md md5 -d -pass -in .env.dev -out .env.enc.dev`,
and to manage all the conflicts pf the file decrypt toe `.env.enc` to another location,
compare the differences and update the encrypted data with both files.

## For live-reload

In order to make it work follow these steps:

##### For android:
1) Run `cordova prepare android` (you need to do this only once)
2) `npm run dev:android` <sup>1</sup>
3) `cordova run android --noprepare`. You can also use android studio and hit `run` and run the app on either a device or an emulator.

Note:

 <sup>1</sup> During `step 2` the script will update `energylink-connect2/platforms/android/app/src/main/res/xml/config.xml`.
 That's why it's important to first run `cordova prepare android`, since this command will create `config.xml` file,
 and `cordova run android` will run this configuration in your phone.

##### For ios:
1) Run `cordova prepare ios` (you need to do this only once)
2) `npm run dev:ios` <sup>1</sup>
3) `cordova run ios --noprepare`. You can also use xcode and hit `run` and run the app on either a device or an emulator.

Note:
 <sup>1</sup> During `step 2` the script will update `energylink-connect2/platforms/ios/SunPowerProConnect-dev/config.xml`.
 That's why it's important to first run `cordova prepare ios`, since this command will create `config.xml` file,
 and `cordova run ios --noprepare` will run this configuration in your phone.


 <sup>2</sup> During `step 2` the script will update `energylink-connect2/platforms/android/app/src/main/res/xml/config.xml`.
 That's why it's important to first run `cordova prepare android`, since this command will create `config.xml` file,
 and `cordova run android` will run this configuration in your phone.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### Feature Flags

These are the different feature flags JSON end-points per flavor:

```
https://sunpower-dev-cm2-config.s3-us-west-2.amazonaws.com/prod/featureFlags.json
https://sunpower-dev-cm2-config.s3-us-west-2.amazonaws.com/test/featureFlags.json
https://sunpower-dev-cm2-config.s3-us-west-2.amazonaws.com/training/featureFlags.json
https://sunpower-dev-cm2-config.s3-us-west-2.amazonaws.com/uat/featureFlags.json
```

Right now, the only one with access to update any feature flag or add a new one, is Alvin Cheung.

We request an update of the feature flags any time a user login successfully on `LOGIN_SUCCESS` or the app gain focus on
`DEVICE_RESUME`, we also check an elapsed time of at least `5` minutes have passed since the last successful update.

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

### Storybook

To run storybook in the port `9009`:
`npm run storybook`

# Authentication

On Redux we will have the `user` object with this structure:
```
user: {
  auth: {
    {
    "access_token": "super_long_string_here",
    "refresh_token": "LzVsRwLn4rJdWrCtHtIe4MV6smnYQC27LDrch6wKOC",
    "token_type": "Bearer",
    "expires_in": 28799
    }
  },
  data: {
    "name": "Pyotr Tchaikovsky",
    "sub": "spwr_dev_adm@outlook.com",
    "userGroup": "Customer",
    "email": "spwr_dev_adm@outlook.com",
    "uniqueId": "bb118107-802a-4d77-9e57-d71eda6ed8c1",
    "exp": 1576642407,
    "scope": [],
    "client_id": "CM2Mobile"
  }
}
```
In order to do API calls, use the `user.auth.access_token` value


The diagrams need to be opened using draw.io :)
