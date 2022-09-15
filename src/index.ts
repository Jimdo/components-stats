// Inspired by https://www.twilio.com/blog/insights-metrics-inform-paste-design-system

const shell = require('shelljs');
const fs = require('node:fs');
const path = require('node:path');
const { cwd } = require('node:process');
import { getFilteredReposWithPackageForOrg, RelevantRepo } from 'package-adoption';

const { cloneReposList } = require('./cloneReposList');

const { ORG, PKG_NAME, GH_AUTHTOKEN, DAYS_UNTIL_STALE, COMPONENTS } = require('../config');

const currentLocation = cwd();
const reposLocalDir = path.join(currentLocation, 'repositories');
const pkgAdoptionReport = path.join(currentLocation, 'pkgAdoption.json');
const reportsOutputDir = path.join(currentLocation, 'reports_by_repo');
const reactScannerConfig = path.join(currentLocation, 'react-scanner.config.js');

(async () => {
  const relevantRepos: RelevantRepo[] | undefined = await getFilteredReposWithPackageForOrg(ORG, DAYS_UNTIL_STALE, GH_AUTHTOKEN, PKG_NAME);
  fs.writeFileSync(pkgAdoptionReport, JSON.stringify(relevantRepos));

  if (relevantRepos?.length) {
    cloneReposList(reposLocalDir, relevantRepos, ORG);

    console.log('\n\n[components-stats] - Collect components usage for filtered repositories');

    shell.rm('-rf', `${reportsOutputDir}/*`);
    for (let i = 0; i < relevantRepos.length; i++) {
      const repo = relevantRepos[i];
      const installationPath = repo.installationPath;
      const sourceDir = installationPath === 'root' ? repo.name : path.join(repo.name, installationPath);
      const baseReportFileName = `scanner-report_${repo.name}`; 
      const reportFileName = installationPath === 'root' ? `${baseReportFileName}.json` : `${baseReportFileName}_${installationPath.replace('/', '_')}.json`;
      
      const scannerConfig = {
        crawlFrom: path.join(reposLocalDir, sourceDir),
        includeSubComponents: true,
        importedFrom: PKG_NAME,
        processors: [
          ['count-components-and-props', { outputTo: path.join(reportsOutputDir, reportFileName) }],
        ],
        components: COMPONENTS,
      };

      fs.writeFileSync(reactScannerConfig, `module.exports = ${JSON.stringify(scannerConfig)}`);
      shell.exec(`npx react-scanner -c ${reactScannerConfig}`);
    }
  }
})();
