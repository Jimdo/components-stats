import path from 'path';
import { RelevantRepo } from 'package-adoption';
import { REPOS_LOCAL_DIR } from './constants.js';
import { ScannerConfig } from './types';

export const buildScannerConfig = (
  repo: RelevantRepo,
  pkgName: string,
  reportsOutputDir: string,
  components?: { [Key: string]: boolean }
): ScannerConfig => {
  const installationPath = repo.installationPath;
  const baseReportFileName = `scanner-report_${repo.name}`;
  const sourceDir =
    installationPath === 'root'
      ? repo.name
      : path.join(repo.name, installationPath);
  const reportFileName =
    installationPath === 'root'
      ? `${baseReportFileName}.json`
      : `${baseReportFileName}_${installationPath.replace(/\//g, '_')}.json`;

  const scannerConfig = {
    crawlFrom: path.join(REPOS_LOCAL_DIR, sourceDir),
    includeSubComponents: true,
    importedFrom: pkgName,
    processors: [
      [
        'count-components-and-props',
        { outputTo: path.join(reportsOutputDir, reportFileName) },
      ],
      [
        'raw-report',
        { outputTo: path.join(`${reportsOutputDir}-raw`, reportFileName) },
      ],
    ],
    components,
  };

  return scannerConfig;
};
