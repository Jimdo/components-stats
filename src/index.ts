// Inspired by https://www.twilio.com/blog/insights-metrics-inform-paste-design-system

import { exec, rm } from 'shelljs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import {
  getFilteredReposWithPackageForOrg,
  RelevantRepo,
  Config,
} from 'package-adoption';
import { cloneReposList } from './cloneReposList';

interface LocalConfig extends Config {
  COMPONENTS: any;
}

const {
  ORG,
  PKG_NAME,
  GH_AUTHTOKEN,
  DAYS_UNTIL_STALE,
  COMPONENTS,
}: LocalConfig = require('../config');

const currentLocation = cwd();
const stanitizedPkgName = PKG_NAME.replaceAll('/', '_');
const reposLocalDir = path.join(currentLocation, 'repositories');
const pkgAdoptionReport = path.join(currentLocation, 'pkgAdoption.json');
const reportsOutputDir = path.join(
  currentLocation,
  `reports_by_repo-${stanitizedPkgName}`
);
const reactScannerConfig = path.join(
  currentLocation,
  'react-scanner.config.js'
);

(async () => {
  const relevantRepos: RelevantRepo[] | undefined =
    await getFilteredReposWithPackageForOrg({
      org: ORG,
      daysUntilStale: DAYS_UNTIL_STALE,
      ghAuthToken: GH_AUTHTOKEN,
      pkgName: PKG_NAME,
    });
  fs.writeFileSync(pkgAdoptionReport, JSON.stringify(relevantRepos));

  if (relevantRepos?.length) {
    cloneReposList(reposLocalDir, relevantRepos, ORG);

    console.log(
      '\n\n[components-stats] - Collect components usage for filtered repositories'
    );

    rm('-rf', `${reportsOutputDir}/*`);
    for (let i = 0; i < relevantRepos.length; i++) {
      const repo = relevantRepos[i];
      const installationPath = repo.installationPath;
      const sourceDir =
        installationPath === 'root'
          ? repo.name
          : path.join(repo.name, installationPath);
      const baseReportFileName = `scanner-report_${repo.name}`;
      const reportFileName =
        installationPath === 'root'
          ? `${baseReportFileName}.json`
          : `${baseReportFileName}_${installationPath.replaceAll(
              '/',
              '_'
            )}.json`;

      const scannerConfig = {
        crawlFrom: path.join(reposLocalDir, sourceDir),
        includeSubComponents: true,
        importedFrom: PKG_NAME,
        processors: [
          [
            'count-components-and-props',
            { outputTo: path.join(reportsOutputDir, reportFileName) },
          ],
        ],
        components: COMPONENTS,
      };

      fs.writeFileSync(
        reactScannerConfig,
        `module.exports = ${JSON.stringify(scannerConfig)}`
      );
      exec(`npx react-scanner -c ${reactScannerConfig}`);
    }
  }
})().catch(err => {
  console.error(err);
});
