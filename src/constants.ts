import { cwd } from 'process';
import path from 'path';

const currentLocation = cwd();

export const REPOS_LOCAL_DIR = path.join(currentLocation, 'repositories');
export const PKG_ADOPTION_REPORT = path.join(
  currentLocation,
  'pkgAdoption.json'
);
export const REACT_SCANNER_CONFIG = path.join(
  currentLocation,
  'react-scanner.config.js'
);
export const REPORTS_OUTPUT_DIR_PREFIX = path.join(
  currentLocation,
  'reports_by_repo-'
);
