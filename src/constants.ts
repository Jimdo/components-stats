import path from 'path';
import { cwd } from 'process';

const currentLocation = cwd();

export const REPOS_LOCAL_DIR = path.join(currentLocation, 'repositories');
export const PKG_ADOPTION_REPORT = path.join(
  currentLocation,
  'pkgAdoption.json'
);
export const REPORTS_OUTPUT_DIR_PREFIX = path.join(
  currentLocation,
  'reports_by_repo-'
);
