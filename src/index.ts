// Inspired by https://www.twilio.com/blog/insights-metrics-inform-paste-design-system

import { exec, rm } from 'shelljs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import {
  getFilteredReposWithPackageForOrg,
  RelevantRepo,
  InputParameters,
} from 'package-adoption';
import { cloneReposList } from './cloneReposList';

interface LocalConfig extends InputParameters {
  components: any;
}

const {
  org,
  pkgName,
  ghAuthToken,
  daysUntilStale,
  components,
}: LocalConfig = require('../config');

const currentLocation = cwd();
const stanitizedPkgName = pkgName.replaceAll('/', '_');
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
      org,
      daysUntilStale,
      ghAuthToken,
      pkgName,
    });
  fs.writeFileSync(pkgAdoptionReport, JSON.stringify(relevantRepos));

  if (relevantRepos?.length) {
    cloneReposList(reposLocalDir, relevantRepos, org);

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
        importedFrom: pkgName,
        processors: [
          [
            'count-components-and-props',
            { outputTo: path.join(reportsOutputDir, reportFileName) },
          ],
        ],
        components,
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
