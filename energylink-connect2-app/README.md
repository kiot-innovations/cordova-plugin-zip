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
