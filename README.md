# @jimdo/components-stats

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

Collect usage statistics for any npm package exposing React UI components, across a GitHub organization; based on [Twilio.com blogpost](https://www.twilio.com/blog/insights-metrics-inform-paste-design-system).

## Purpose

The aim is to provide better understanding of Design System or other shared UI libraries usage across the organization.
This tool will facilitate things such as: deprecation of unused components and props, detection of misuse, set-up of alerts.

## Compiling & Running Locally

Create a **config.js** file based on `config.example`.

A GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with scope `repo` is required, to access the `org` private repositories through GitHub APIs.

Usage for `pkgName` will be analyzed across `org`, excluding repositories that did not receive any commit in the last `daysUntilStale` days.
Be patient, this will take some time.

The list of repositories having `pkgName` as dependency is collected through the [**components-stats**](https://github.com/Jimdo/components-stats) npm module.

Omit `components` to report all components.

> :warning: The script will clone all the eligible repositories locally and use them as source for [react-scanner](https://github.com/moroshko/react-scanner). If a repository already exists locally, it will update it with a `git pull`.

```bash

# Install dependencies using npm
$ > npm i

# Start
$ > npm start
```

## Results

The script outputs:

- a `pkgAdoption.json` file with the list of repositories that include `pkgName` as a dependency.

- a `reports_by_repo` folder with one `scanner-report_[repo_name_subdir].json` file for each repository. Each file is a report with the usage of React components exposed by the `pkgName` library.
  [react-scanner](https://github.com/moroshko/react-scanner) is used to produce the report.

[build-img]: https://github.com/jimdo/components-stats/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/jimdo/components-stats/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/components-stats
[downloads-url]: https://www.npmtrends.com/components-stats
[npm-img]: https://img.shields.io/npm/v/components-stats
[npm-url]: https://www.npmjs.com/package/components-stats
[issues-img]: https://img.shields.io/github/issues/jimdo/components-stats
[issues-url]: https://github.com/jimdo/components-stats/issues
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
