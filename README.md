# @jimdo/components-stats

Collect usage statistics for any npm package exposing React UI components, across a GitHub organization; based on [Twilio.com blogpost](https://www.twilio.com/blog/insights-metrics-inform-paste-design-system).

## Purpose

The aim is to provide better understanding of Design System or other shared UI libraries usage across the organization.
This tool will facilitate deprecation of unused components and props, detection of misuse, set-up of alerts.

## Compiling & Running Locally

Create a **config.js** file based on `config.example`. 
A GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with scope `repo` is required, to access the `ORG` private repositories through GitHub APIs.
Usage for `PKG_NAME` will be analyzed across `ORG`, excluding repositories that did not receive any commit in the last `DAYS_UNTIL_STALE` days.
Omit `COMPONENTS` to report all components.

Make sure `$NPM_TOKEN` is being exported as an environmental variable since we use this to authenticate to our private NPM package repository.

```bash

# Install dependencies using npm
$ > npm i

# Start
$ > npm start
```

> :warning: GitHub API [are rate limited](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting), we need to find a way to avoid errors because of this.

## Results

The script outputs:

- a `pkgAdoption.json` file with the list of repositories that include `PKG_NAME` as a dependency.

- a `reports_by_repo` folder with one `scanner-report_[repo_name].json` file for each repository. Each file is a report with the usage of React components exposed by the `PKG_NAME` library. [react-scanner](https://github.com/moroshko/react-scanner) is used to produce the report.

