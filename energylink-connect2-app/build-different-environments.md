# How to build to different environments

## Develop

We need to manage two different environments, either develop or production.
For that, we will be using two encrypted files, one `.env.enc` will be the
production one, and the second will be `.env.dev`, which will contain the
encrypted keys of the development environment.


To decrypt either of the files, we need to run the command
`openssl aes-256-cbc -d -a -salt -in <encrypte-file> -out .env.development`
 and `openssl aes-256-cbc -d -a -salt -in <encrypte-file> -out .env.production`

Both will set whenever we want to build our app into our phones and when we
want to develop in the browser and don't have any of our precious keys in our testing environments.

