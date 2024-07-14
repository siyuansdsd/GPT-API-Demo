# GPT-API-Demo

# Table of Content

- [Introduction](#introduction)
- [Technologies](#technologies-used)
- [Getting_Started](#getting-started)

## Introduction

Really thank you for watching this project!

There is 2 api for goals:
https://ncpr6b0hud.execute-api.ap-southeast-2.amazonaws.com/prod/api/v2
https://ncpr6b0hud.execute-api.ap-southeast-2.amazonaws.com/prod/api/v1

you should add JSON body { "input": "inputName" }, use PUT HTTP METHOD to check its performance

## Technologies Used

- [TypeScript](https://github.com/microsoft/TypeScript)
- Openai_api
- Pinecone_vector_DB

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
