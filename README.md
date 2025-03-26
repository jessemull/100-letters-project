# 100 Letters Project

The **100 Letters Project** is driven by the desire to promote real human interaction in an increasingly digital world and create meaningful connections through handwritten communication. Over the course of a year I will write 100 letters to 100 individuals.

The **100 Letters Project** website showcases these exchanges, offering a digital display of the letters with details about the recipients and the reasons behind their selection.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Environments](#environments)
   - [Test Environment](#test-environment)
   - [Production Environment](#production-environment)
3. [Tech Stack](#tech-stack)
4. [Setup Instructions](#setup-instructions)
5. [Commits & Commitizen](#commits--commitizen)
   - [Making a Commit](#making-a-commit)
6. [Linting & Formatting](#linting--formatting)
   - [Linting Commands](#linting-commands)
   - [Formatting Commands](#formatting-commands)
   - [Pre-Commit Hook](#pre-commit-hook)
7. [Unit Tests & Code Coverage](#unit-tests--code-coverage)
   - [Unit Tests](#unit-tests)
   - [Fishery Factories](#fishery-factories)
   - [Code Coverage](#code-coverage)
8. [Development Website Proxy](#development-website-proxy)
   - [Environment Variables](#environment-variables)
   - [Running The Proxy](#running-the-proxy)
9. [E2E Tests](#e2e-tests)
   - [Configuration](#configuration)
   - [Running E2E Tests - Development](#running-e2e-tests---development)
   - [Running E2E Tests - Test](#running-e2e-tests---test)
   - [Running E2E Tests - Production](#running-e2e-tests---production)
10. [Lighthouse](#lighthouse)
    - [Configuration](#configuration-1)
    - [Running Lighthouse - Development](#running-lighthouse---development)
    - [Running Lighthouse - Test](#running-lighthouse---test)
    - [Running Lighthouse - Production](#running-lighthouse---production)
    - [Code Coverage](#code-coverage-1)
11. [Accessibility](#accessibility)
12. [Build](#build)
    - [Environment Variables](#environment-variables-1)
    - [Pre-build Script](#pre-build-script)
    - [Post-build script](#post-build-script)
    - [Build](#build-1)
    - [Building The Development Server](#building-the-development-server)
13. [Deployment Pipelines](#deployment-pipelines)
    - [Deployment Strategy](#deployment-strategy)
    - [Tools Used](#tools-used)
    - [Pull Request](#pull-request)
    - [Deploy](#deploy-on-merge)
    - [Deploy On Merge](#deploy-on-merge)
    - [Rollback](#rollback)
14. [Cognito ID Token](#cognito-id-token)
15. [Connecting to the Bastion Host](#connecting-to-the-bastion-host)
    - [Environment Variables](#environment-variables-2)
16. [License](#license)

## Project Overview

This project uses a NextJS static export to an S3 bucket behind AWS Cloudfront. All read data is fetched during the build from the 100 letters project API and loaded into a JSON file inside of the public directory. Any write operations are protected via user login and AWS Cognito authentication.

## Environments

The **100 Letters Project** operates in multiple environments to ensure smooth development, testing, and production workflows. Each environment includes custom DNS and a separate cloudfront distribution.

### Test Environment

The test environment is protected via signed cookies and is inaccessible to the public.

- `https://dev.onehundredletters.com`
- `https://www.dev.onehundredletters.com`

### Production Environment

The production environment is open to the public.

- `https://onehundredletters.com`
- `https://www.onehundredletters.com`

## Tech Stack

The **100 Letters Project Website** is built using modern web technologies to ensure a fast, scalable and cost-effective site.

- **AWS CloudFormation**: Infrastructure as Code (IaC) is used to define and provision AWS resources like S3, CloudFront and IAM roles in a consistent and repeatable manner.

- **Next.js**: A React-based framework used to build the website, providing server-side rendering (SSR), static site generation (SSG), and optimized performance for SEO and fast load times.

- **AWS CloudFront**: A content delivery network (CDN) used to distribute the website globally, reducing latency and improving load times by caching static assets close to users.

- **AWS S3**: Hosts the statically generated website, ensuring high availability, durability, and cost-efficient storage for the project's front-end assets.

- **GitHub Actions**: A CI/CD pipeline automating the deployment process, including build verification, static analysis, and rollback capabilities in case of failed deployments.

- **Cypress**: An end-to-end (E2E) testing framework that ensures the website functions correctly across different user flows by simulating real interactions with the UI.

- **Lighthouse**: A performance and accessibility auditing tool that evaluates site speed, best practices, and SEO, helping optimize the user experience.

- **Jest**: A JavaScript testing framework used for unit and integration testing, ensuring code reliability and preventing regressions.

- **ESLint & Prettier**: Linting and formatting tools that enforce code consistency, reduce syntax errors, and improve maintainability across the codebase.

- **Commitizen**: A tool for enforcing a standardized commit message format, improving version control history and making collaboration more structured.

- **HTTP Proxy**: Used to sign cookies and securely proxy requests to the development website, enabling local testing and authentication workflows.

This tech stack ensures that the **100 Letters Project** website remains performant, secure, and easily maintainable while leveraging AWS infrastructure for scalability and reliability.

## Setup Instructions

To clone the repository, install dependencies, and run the project locally follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/jessemull/100-letters-project.git
   ```

2. Navigate into the project directory:

   ```bash
   cd 100-letters-project
   ```

3. Install the root dependencies:

   ```bash
   npm install
   ```

4. Set environment variables:

   The development server has a predev script that will check for static data loaded during the build at public/data.json. If the file is missing, the script will fetch the data required to run the application. The predev script uses machine user credentials to grab a cognito token using the following environment variables set in a `.env.test` and `.env.production` files in the root of the project:

   ```
   COGNITO_USER_POOL_USERNAME=cognito-user-pool-username
   COGNITO_USER_POOL_PASSWORD=cognito-user-pool-password
   COGNITO_USER_POOL_CLIENT_ID=cognito-user-pool-client-id
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

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

## Unit Tests & Code Coverage

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

### Fishery Factories

Fishery factory functions to provide mock data are available for all of the models used by the 100 letters project. Factories are located at src/factories:

- Correspondences
- Letters
- Recipients

### Code Coverage

Coverage thresholds are enforced at **80%** for all metrics. The build will fail if coverage drops below this threshold.

## Development Website Proxy

The development/test website environment is protected via signed cookies. The proxy server signs cookies and then proxies to the development domain.

### Environment Variables

The following environment variables must be set in a `.env.local` file in the root of the project to run the proxy:

```
CLOUDFRONT_KEY_PAIR_ID=cloudfront-key-pair-id
CLOUDFRONT_DOMAIN=test-domain
CLOUDFRONT_PRIVATE_KEY_PATH=path-to-private-key
```

### Running The Proxy

To run the proxy and access the test website:

```bash
npm run proxy
```

## E2E Tests

This project uses **Cypress** for end to end testing. The build will fail on end to end test failure.

### Configuration

Lighthouse tests for the development/test domain must be run through the proxy server with the appropriate environment variables set (see running the proxy).

In order to have the proxy work as expected and not impact performance, throttling has been set to devtools in the lighthouse config and the proxy is set up to cache files and use a temporary redirect after setting signed cookies (307).

### Running E2E Tests - Development

Start the dev server:

```bash
npm run dev
```

Run E2E tests:

```bash
npm run e2e
```

### Running E2E Tests - Test

Start the proxy server:

```bash
npm run proxy
```

Run E2E tests:

```bash
NODE_ENV=test npm run e2e
```

### Running E2E Tests - Production

Run E2E tests:

```bash
NODE_ENV=production npm run e2e
```

## Lighthouse

Lighthouse is used for performance, SEO and accessibility metrics. It is fully integrated into the CI/CD pipeline and runs on pull-request, merge and deployment.

### Configuration

Lighthouse tests for the development/test domain must be run through the proxy server with the appropriate environment variables set (see running the proxy).

In order to have the proxy work as expected and not impact performance, throttling has been set to devtools in the lighthouse config and the proxy is set up to cache files and use a temporary redirect after setting signed cookies (307).

### Running Lighthouse - Development

Start the dev server:

```bash
npm run dev
```

Run lighthouse:

```bash
npm run lighthouse
```

### Running Lighthouse - Test

Start the proxy server:

```bash
npm run proxy
```

Run lighthouse:

```bash
NODE_ENV=test npm run lighthouse
```

### Running Lighthouse - Production

Run lighthouse:

```bash
NODE_ENV=production npm run lighthouse
```

### Code Coverage

Coverage thresholds are enforced at **80%** for all metrics. The build will fail if coverage drops below this threshold.

## Accessibility

Accessibility metrics are measured using lighthouse. All components are unit tested using the jest-axe library.

## Build

This project uses a static export of NextJS. Prior to the build step, a pre-build script is run to fetch any read data from the 100 letters API. A post build script uses next-sitemap to generate robots.txt and site maps. The actual build is run using NextJS internals.

### Environment Variables

The following environment variables must be set in `.env.test` and `env.production` files in the root of the project:

```
API_URL=one-hundred-letters-api-url
COGNITO_USER_POOL_CLIENT_ID=cognito-user-pool-client-id
COGNITO_USER_POOL_PASSWORD=cognito-user-pool-password
COGNITO_USER_POOL_USERNAME=cognito-user-pool-username
```

### Pre-build Script

The pre-build script generates a cognito token using machine user credentials, fetches the read data and writes to a static file public/data.json.

To run the pre-build script:

```bash
npm run prebuild
```

### Post-build script

The post-build script uses the next-sitemap package to generate sitemaps and robots.txt for SEO purposes.

To run the post-build script:

```bash
npm run postbuild
```

### Build

To build the project using the test environment:

```bash
NODE_ENV=test npm run build
```

To build the project using the production environment:

```bash
NODE_ENV=production npm run build
```

### Building The Development Server

The development server has a predev script that will check for static data loaded during the build at public/data.json. If the file is missing, the script will fetch the data and write it. The predev script uses machine user credentials to grab a cognito token.

The following environment variables must be set in `.env.test` and `env.production` files in the root of the project:

```
COGNITO_USER_POOL_CLIENT_ID=cognito-user-pool-client-id
COGNITO_USER_POOL_PASSWORD=cognito-user-pool-password
COGNITO_USER_POOL_USERNAME=cognito-user-pool-username
```

To run the pre-dev script:

```bash
npm run predev
```

To run the development server:

```bash
npm run dev
```

## Deployment Pipelines

This project uses automated deployment pipelines to ensure a smooth and reliable deployment process utilizing AWS CloudFormation, GitHub Actions and S3.

### Deployment Strategy

The deployment process for this project ensures reliability and consistency through a combination of versioned artifacts, automated deployments, and rollback mechanisms. The strategy involves the following key components:

- **Versioned Artifacts:** Every deployment is tied to a unique timestamped backup stored in Amazon S3. These backups allow for easy restoration and rollback to a previous state if necessary.
- **GitHub Actions Pipelines:** Automated deployment workflows are used to manage the build, test, and deployment processes. These workflows ensure that each change is properly validated, tested, and deployed to either the `test` or `production` environment based on user input. Manual deployment and rollback are also supported through GitHub Actions.

- **CloudFormation:** Infrastructure management is handled via AWS CloudFormation, which enables version-controlled deployments and updates. This tool helps ensure that infrastructure changes, such as bucket configurations or IAM roles, are consistently applied across environments.

- **Backup and Rollback:** Each deployment to S3 includes a backup of the previous state, enabling easy rollback if any issues arise. If Lighthouse performance tests fail after deployment, the previous version is automatically restored from the backup, and CloudFront cache is invalidated to immediately reflect the changes.

- **Manual and Automated Triggers:** Deployments are typically triggered by pushes to the `main` branch, but manual triggers (via GitHub Actions) are also available for both deployments and rollbacks. This provides flexibility in controlling the deployment process based on the current needs of the team or project.

This strategy ensures that the deployment process is automated, reliable, and easy to manage, with robust rollback options to handle any issues that may arise during deployment.

### Tools Used

- **AWS CLI**: Configures the AWS environment for deployments.
- **GitHub Actions**: Automates and schedules the deployment and rollback pipelines.
- **CloudFormation**: Orchestrates infrastructure changes, including deployments and rollbacks.
- **S3**: Stores function packages for deployment and rollback.

### Pull Request

This pipeline automates the validation process for pull requests targeting the `main` branch. It ensures that new changes are properly built, linted, tested and evaluated for performance before merging.

The pipeline performs the following steps:

1. **Build Next.js** – Checks out the code, installs dependencies, builds the Next.js application, and archives the output.
2. **Lint Code** – Runs ESLint to check for syntax and style issues.
3. **Run Unit Tests** – Executes Jest tests, uploads a coverage report, and ensures test coverage meets the required threshold.
4. **Run E2E & Lighthouse Tests** – Starts a local server, runs Cypress end-to-end tests, and performs Lighthouse performance checks.

This pipeline is defined in the `.github/workflows/pull-request.yml` file.

### Deploy

This pipeline automates the deployment of the Next.js application to an S3 bucket using a static export. It supports deployment to either the test or production environment based on user input.

The pipeline performs the following steps:

1. **Build Next.js** – Checks out the code, installs dependencies, builds the Next.js application, and archives the output.
2. **Run Unit Tests** – Executes Jest tests, uploads a coverage report, and ensures test coverage meets the required threshold.
3. **Backup S3** – Creates a timestamped backup of the existing deployment in S3 before deploying new changes.
4. **Deploy to S3** – Downloads the built application and syncs it to the designated S3 bucket.

This workflow is triggered manually via GitHub Actions using `workflow_dispatch`, allowing users to specify the target environment. The pipeline is defined in the `.github/workflows/deploy.yml` file.

### Deploy On Merge

This workflow runs automatically when changes are pushed to the `main` branch. It builds, tests, deploys the Next.js application to an S3 bucket, and runs end-to-end (E2E) and Lighthouse tests. If Lighthouse tests fail, the deployment is rolled back.

The workflow performs the following steps:

1. **Build Next.js** – Checks out the code, installs dependencies, builds the application, and archives the output.
2. **Run Unit Tests** – Executes Jest tests, uploads a coverage report, and ensures test coverage meets the required threshold.
3. **Backup S3** – Creates a timestamped backup of the current deployment before uploading the new build.
4. **Deploy to S3** – Downloads the archived build output, syncs it to the S3 bucket, and invalidates the CloudFront cache.
5. **Run E2E Tests** – Executes Cypress tests against the deployed site.
6. **Run Lighthouse Tests** – Performs performance and accessibility audits using Lighthouse.
7. **Rollback Deployment** – If Lighthouse tests fail, the workflow restores the previous deployment from the backup.

This workflow is defined in the `.github/workflows/merge.yml` file.

### Rollback Deployment

This workflow allows manual rollback of a deployed Next.js application by restoring a selected backup from S3. It is triggered via GitHub Actions' **workflow dispatch** and requires specifying a backup timestamp and environment.

The workflow performs the following steps:

1. **Restore Selected Backup** – Synchronizes the selected backup from the S3 backup bucket to the main deployment bucket, deleting any newer files.
2. **Invalidate CloudFront Cache** – Clears the CloudFront cache to ensure users receive the restored version immediately.

This workflow is defined in the `.github/workflows/rollback.yml` file.

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
