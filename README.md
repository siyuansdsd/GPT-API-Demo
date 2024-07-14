# GPT-API-Demo

# Table of Content

- [Introduction](#introduction)
- [Technologies](#technologies-used)
- [Getting_Started](#getting-started)
- [Unit_Test](#unit-test)

## Introduction

Really thank you for watching this project!

There is 2 api for goals:
https://ncpr6b0hud.execute-api.ap-southeast-2.amazonaws.com/prod/api/v2
https://ncpr6b0hud.execute-api.ap-southeast-2.amazonaws.com/prod/api/v1

you should add JSON body { "input": "inputName" }, use PUT HTTP METHOD to check its performance

## Technologies Used

- [TypeScript](https://github.com/microsoft/TypeScript)
- [Openai_api](https://github.com/openai/)
- [Pinecone_vector_DB](https://github.com/pinecone-io)
- [AWS_CDK](https://github.com/aws/aws-cdk)

## Getting Started

1. Clone the repository to your local machine.

2. Install the project dependencies by running:

```bash
$ npm install
```

3. Create an env file, and it should contained:
   you can copy from [.env.example]('/.env.example')

```txt
CDK_DEFAULT_ACCOUNT=
CDK_DEFAULT_REGION=
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=name-vector
```

4. init Pinecone vector DB

```bash
$ npm run initDB
```

5. using webpack pack files

```bash
$ npm run build
```

6. using cdk finish Lambda function deploy

first time will spend about 3 mins on building

```bash
$ npm run deploy
```

7. then you will find your api url

you can using 2 ways(using PUT METHOD with body { "input": "input_name" }) by:
1./api/v1
2./api/v2

## Unit Test

You can run

```bash
$ npm run test:cov
```

And compare with this result(100% coverage), if there is any different please contact me

```txt

=============================== Coverage summary ===============================
Statements   : 100% ( 103/103 )
Branches     : 100% ( 37/37 )
Functions    : 100% ( 24/24 )
Lines        : 100% ( 95/95 )
================================================================================
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files               |     100 |      100 |     100 |     100 |
 controller/v1          |     100 |      100 |     100 |     100 |
  v1.controller.ts      |     100 |      100 |     100 |     100 |
 controller/v2          |     100 |      100 |     100 |     100 |
  v2.controller.ts      |     100 |      100 |     100 |     100 |
 service                |     100 |      100 |     100 |     100 |
  names.service.ts      |     100 |      100 |     100 |     100 |
  openAI.service.ts     |     100 |      100 |     100 |     100 |
  vectorhint.service.ts |     100 |      100 |     100 |     100 |
------------------------|---------|----------|---------|---------|-------------------
Test Suites: 5 passed, 5 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        2.674 s, estimated 3 s
Ran all test suites.
```
