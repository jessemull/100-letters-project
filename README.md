# 100 Letters Project API

The **100 Letters Project** is driven by the desire to promote real human interaction in an increasingly digital world and create meaningful connections through handwritten communication. Over the course of a year I will write 100 letters to 100 individuals.

The **100 Letters Project** website showcases these exchanges, offering a digital display of the letters with details about the recipients and the reasons behind their selection.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Environments](#environments)
3. [Tech Stack](#tech-stack)
4. [Setup Instructions](#setup-instructions)
5. [Commits & Commitizen](#commits--commitizen)
6. [Linting & Formatting](#linting--formatting)
   - [Linting Commands](#linting-commands)
   - [Formatting Commands](#formatting-commands)
   - [Pre-Commit Hook](#pre-commit-hook)
7. [Testing & Code Coverage](#testing--code-coverage)
   - [Unit Tests](#unit-tests)
   - [E2E Tests](#e2e-tests)
   - [Fishery Factories](#fishery-factories)
   - [Code Coverage](#code-coverage)
8. [Development Website Proxy](#development-website-proxy)
9. [Lighthouse](#lighthouse)
10. [Accessibility](#accessibility)
11. [Build](#build)
    - [Install](#install)
    - [Build](#build)
12. [Deployment Pipelines](#deployment-pipelines)
    - [Deployment Strategy](#deployment-strategy)
    - [Tools Used](#tools-used)
    - [Pull Request](#pull-request)
    - [Deploy](#deploy-on-merge)
    - [Deploy On Merge](#deploy-on-merge)
    - [Rollback](#rollback)
13. [Cognito ID Token](#cognito-id-token)
14. [Connecting to the Bastion Host](#connecting-to-the-bastion-host)
    - [Environment Variables](#environment-variables)
15. [License](#license)

## Project Overview

Coming soon...

## Environments

Coming soon...

## Tech Stack

Coming soon...

## Setup Instructions

Coming soon...

## Commits & Commitizen

This project uses **Commitizen** to ensure commit messages follow a structured format and versioning is consistent. Commit linting is enforced via a pre-commit husky hook.

### Making a Commit

To make a commit in the correct format, run the following command. Commitzen will walk the user through the creation of a structured commit message and versioning:

```bash
npm run commit
```

## Linting & Formatting

This project uses **ESLint** and **Prettier** for code quality enforcement. Linting is enforced during every CI/CD pipeline to ensure consistent standards.

### Linting Commands

Run linting:

```bash
npm run lint
```

### Formatting Commands

Format using prettier:

```bash
npm run format
```

### Pre-Commit Hook

**Lint-staged** is configured to run linting before each commit. The commit will be blocked if linting fails, ensuring code quality at the commit level.

## Testing & Code Coverage

### Unit Tests

This project uses **Jest** for testing. Code coverage is enforced during every CI/CD pipeline. The build will fail if any tests fail or coverage drops below **80%**.

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### E2E Tests

This project uses **Cypress** for end to end testing. The build will fail if any end to end test fails.

Run E2E tests:

```bash
npm run e2e
```

### Fishery Factories

Coming soon...

### Code Coverage

Coverage thresholds are enforced at **80%** for all metrics. The build will fail if coverage drops below this threshold.

## Development Website Proxy

Coming soon...

## Lighthouse

Coming soon...

## Accessibility

Coming soon...

## Build

Coming soon...

## Deployment Pipelines

Coming soon...

### Deployment Strategy

Each deployment process involves:

Coming soon...

### Tools Used

Coming soon...

### Pull Request

Coming soon...

### Deploy

Coming soon...

### Deploy On Merge

Coming soon...

### Rollback

Coming soon...

## Cognito ID Token

All write routes are protected via Cognito User Pools. A valid ID token is required to use these endpoints.

### Generating An ID Token

To generate a valid ID token:

```bash
npm run token
```

### Using An ID Token

To use the token add it to the Authorization request header:

```bash
curl -X POST "https://api-dev.onehundredletters.com/<stage>/<route>"  -H "Authorization: Bearer <token>"
```

### Environment Variables

The following environment variables must be set in a `.env.test` and `.env.production` file in the root of the project to generate a token:

```
COGNITO_USER_POOL_ID=cognito-user-pool-id
COGNITO_USER_POOL_USERNAME=cognito-user-pool-username
COGNITO_USER_POOL_PASSWORD=cognito-user-pool-password
COGNITO_USER_POOL_CLIENT_ID=cognito-user-pool-client-id
```

## Connecting to the Bastion Host

To connect to the AWS EC2 bastion host and access AWS resources, you can use the following command:

```bash
npm run bastion
```

### Environment Variables

The following environment variables must be set in a `.env.local` file in the root of the project:

```
SSH_PRIVATE_KEY_PATH=/path/to/your/private/key
SSH_USER=your-ssh-username
SSH_HOST=your-ec2-instance-hostname-or-ip
```

Ensure you have the appropriate permissions set on your SSH key for secure access.

## License

    Apache License
    Version 2.0, January 2004
    http://www.apache.org/licenses/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---
