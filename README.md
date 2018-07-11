# CiscoWish API

This is a CiscoWish API.

Here I'm using Node.js with Express, TypeScript, MongoDB and Docker.


## Documentation - Avaliable endpoints

Currently there's a Task controller with all the possible operations and some endpoints related to it.
In order to see which endpoints are available, you need to have gulp installed:

```bash
$ npm i -g gulp
$ cd api && gulp apidoc && gulp swagger
```

This will generate the documentation for the API inside docs/apidoc.

Enter the api directory and run:
```bash
$ yarn install && gulp
```

## Testing and checking code coverage report

In order to test, you need to have the packages installed and infra running (previous step).

After that is done, run the following command:
```bash
$ npm test
```

This command will use gulp to transpile the typescript files to the api/bin directory, then mocha to run the tests and istanbul to generate the code coverage report.
After all is done, you will find the report inside api/coverage/lcov-report/index.html
