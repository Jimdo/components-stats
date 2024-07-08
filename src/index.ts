import shelljsPkg from 'shelljs';
const { rm } = shelljsPkg;

import fs from 'fs';
import {
  getFilteredReposWithPackageForOrg,
  RelevantRepo,
} from 'package-adoption';
import { cloneReposList } from './cloneReposList.js';
import { buildScannerConfig } from './buildScannerConfig.js';
import scanner from 'react-scanner';
import {
  PKG_ADOPTION_REPORT,
  REPORTS_OUTPUT_DIR_PREFIX,
  REPOS_LOCAL_DIR,
} from './constants.js';
import { LocalConfig } from './types';

/*
 *   1. It is using the `getFilteredReposWithPackageForOrg` function from package-adoption to get a list of relevant repos.
 *   2. It is cloning the relevant repos to a local directory.
 *   3. It is using the `react-scanner` package to scan the relevant repos for components usage.
 *   4. It is saving the results to a file.
 */
export const scanOrg = async (config: LocalConfig) => {
  const { org, pkgName, ghAuthToken, daysUntilStale, components }: LocalConfig =
    config;

  const stanitizedPkgName = pkgName.replaceAll('/', '_');
  const reportsOutputDir = `${REPORTS_OUTPUT_DIR_PREFIX}${stanitizedPkgName}`;

  const relevantRepos: RelevantRepo[] | undefined =
    await getFilteredReposWithPackageForOrg({
      org,
      daysUntilStale,
      ghAuthToken,
      pkgName,
    });

  if (relevantRepos?.length) {
    fs.writeFileSync(PKG_ADOPTION_REPORT, JSON.stringify(relevantRepos));

    cloneReposList(REPOS_LOCAL_DIR, relevantRepos, org);

    console.log(
      '\n\n[components-stats] - Collect components usage for filtered repositories'
    );

    rm('-rf', `${reportsOutputDir}/*`);

    for (let i = 0; i < relevantRepos.length; i++) {
      const repo = relevantRepos[i];
      const scannerConfig = buildScannerConfig(
        repo,
        pkgName,
        reportsOutputDir,
        components
      );

      scanner.run(scannerConfig);
    }
  }
};
