// Inspired by https://www.twilio.com/blog/insights-metrics-inform-paste-design-system

const shell = require('shelljs');
const fs = require('node:fs');
const path = require('node:path');
const { cwd } = require('node:process');
const { getAllRelevantReposForOrg } = require('./getAllRelevantReposForOrg');
const { cloneReposList } = require('./cloneReposList');

const { ORG, PKG_NAME, DAYS_UNTIL_STALE, COMPONENTS } = require('../config');

const currentLocation = cwd();
const reposLocalDir = path.join(currentLocation, 'repositories');
const pkgAdoptionReport = path.join(currentLocation, 'pkgAdoption.json');
const reportsOutputDir = path.join(currentLocation, 'reports_by_repo');
const reactScannerConfig = path.join(currentLocation, 'react-scanner.config.js');

type RelevantRepo = {
  name: string;
  installationPath: string;
  libVersion: string;
};

(async () => {
  const relevantRepos: RelevantRepo[] | undefined = await getAllRelevantReposForOrg(ORG, DAYS_UNTIL_STALE);
  fs.writeFileSync(pkgAdoptionReport, JSON.stringify(relevantRepos));

  if (relevantRepos?.length) {
    cloneReposList(reposLocalDir, relevantRepos, ORG);

    console.log('Collect components usage for filtered repositories');

    shell.rm('-rf', `${reportsOutputDir}/*`);
    for (let i = 0; i < relevantRepos.length; i++) {
      const repo = relevantRepos[i];
      const scannerConfig = {
        crawlFrom: path.join(reposLocalDir, repo.name),
        includeSubComponents: true,
        importedFrom: PKG_NAME,
        processors: [
          ['count-components-and-props', { outputTo: path.join(reportsOutputDir, `scanner-report_${repo.name}.json`) }],
        ],
        components: COMPONENTS,
      };

      fs.writeFileSync(reactScannerConfig, `module.exports = ${JSON.stringify(scannerConfig)}`);
      shell.exec(`npx react-scanner -c ${reactScannerConfig}`);
    }
  }
})();
