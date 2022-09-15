# @jimdo/components-stats

Collect usage statistics for any npm package exposing React UI components, across a GitHub organization; based on [Twilio.com blogpost](https://www.twilio.com/blog/insights-metrics-inform-paste-design-system).

## Purpose

The aim is to provide better understanding of Design System or other shared UI libraries usage across the organization.
This tool will facilitate things such as: deprecation of unused components and props, detection of misuse, set-up of alerts.

## Compiling & Running Locally

Create a **config.js** file based on `config.example`. 

A GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with scope `repo` is required, to access the `ORG` private repositories through GitHub APIs.

Usage for `PKG_NAME` will be analyzed across `ORG`, excluding repositories that did not receive any commit in the last `DAYS_UNTIL_STALE` days.
Be patient, this will take some time.

The list of repositories having `PKG_NAME` as dependency is collected through the [**package-adoption**](https://github.com/Jimdo/package-adoption) npm module.

Omit `COMPONENTS` to report all components.


> :warning: The script will clone all the eligible repositories locally and use them as source for [react-scanner](https://github.com/moroshko/react-scanner). If a repository already exists locally, it will update it with a `git pull`.

```bash

# Install dependencies using npm
$ > npm i

# Start
$ > npm start
```


## Results

The script outputs:

- a `pkgAdoption.json` file with the list of repositories that include `PKG_NAME` as a dependency.

- a `reports_by_repo` folder with one `scanner-report_[repo_name_subdir].json` file for each repository. Each file is a report with the usage of React components exposed by the `PKG_NAME` library. 
[react-scanner](https://github.com/moroshko/react-scanner) is used to produce the report.

