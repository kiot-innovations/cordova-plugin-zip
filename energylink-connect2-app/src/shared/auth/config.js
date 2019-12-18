export default {
  // Specifies the grant type of the token request. Options are authorization_code, implicit, and client_credentials
  grantType: 'authorization_code',
  // Specifies the URL that specifies the return entry point of the application. This is a required property.
  redirectUri: process.env.REACT_APP_PING_REDIRECT_URI,
  // Specifies permissions that determine the resources that the application can access. This parameter is not required, but it is needed to specify accessible resources.
  scope: 'openid profile email address phone',
  // FEDERATED AUTH
  client_id: process.env.REACT_APP_PING_AC_CLIENT,
  response_type: 'code',
  secret: process.env.REACT_APP_PING_AUTH_SECRET,
  token_secret: process.env.REACT_APP_PING_TOKEN_CHECK_SECRET,
  FED_AUTH_URI: process.env.REACT_APP_PING_AUTH_URI,
  FED_TOKEN_URI: process.env.REACT_APP_PING_TOKEN_URI,
  FED_TOKEN_CHECK_URI: process.env.REACT_APP_PING_TOKEN_CHECK_URI,
  FED_USER_INFO_URI: process.env.REACT_APP_PING_USER_INFO_URI
}
