# @jimdo/components-stats

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

Collect usage statistics for any npm package exposing React UI components, across a GitHub organization.
Inspired by [Twilio.com blogpost](https://www.twilio.com/blog/insights-metrics-inform-paste-design-system).

## Purpose

The aim is to provide better understanding of Design System or other shared UI libraries usage across the organization.
This tool will facilitate things such as: deprecation of unused components and props, detection of misuse, set-up of alerts.

## Compiling & Running Locally

Create a **config.json** file based on `config.example`.

A GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with scope `repo` is required, to access the `org` private repositories through GitHub APIs.

Usage for `pkgName` will be analyzed across `org`, excluding repositories that did not receive any commit in the last `daysUntilStale` days.
Be patient, this will take some time.

The list of repositories having `pkgName` as dependency is collected through the [**package-adoption**](https://github.com/Jimdo/package-adoption) npm module.

Omit `components` to report all components.

> [!WARNING]
> The script will clone all the eligible repositories locally and use them as source for [react-scanner](https://github.com/moroshko/react-scanner). If a repository already exists locally, it will update it with a `git pull`.

```bash

# Install dependencies using npm
$ > npm i

# Start
$ > npm start
```

## Results

The script outputs:

- a `pkgAdoption.json` file with the list of repositories that include `pkgName` as a dependency.

- two `reports_by_repo` folders with one `scanner-report_[repo_name_subdir].json` file for each repository. Each file is a report with the usage of React components exposed by the `pkgName` library.
  [react-scanner](https://github.com/moroshko/react-scanner) is used to produce two kind of reports: one with the [count-components-and-props](https://www.npmjs.com/package/react-scanner#count-components-and-props) processor and one with the [raw-report](https://www.npmjs.com/package/react-scanner#raw-report) processor, reporting all the props values.

## Install

```bash
npm install @jimdo/components-stats
```

## Usage

```ts
import { scanOrg } from '@jimdo/components-stats';

const config = {
  org: 'github_org_name',
  pkgName: '@org/package',
  ghAuthToken: 'github_auth_token',
  daysUntilStale: '730',
  components: { Accordion: true, Button: true },
};

await scanOrg(config);
```

[build-img]: https://github.com/jimdo/components-stats/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/jimdo/components-stats/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/@jimdo/components-stats
[downloads-url]: https://www.npmtrends.com/@jimdo/components-stats
[npm-img]: https://img.shields.io/npm/v/@jimdo/components-stats
[npm-url]: https://www.npmjs.com/package/@jimdo/components-stats
[issues-img]: https://img.shields.io/github/issues/jimdo/components-stats
[issues-url]: https://github.com/jimdo/components-stats/issues
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
