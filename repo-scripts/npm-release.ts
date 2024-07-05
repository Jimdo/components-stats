/* eslint-disable no-process-exit */
import fs from 'fs';
import childProcess, { execSync } from 'child_process';
import type { PackageJson } from 'type-fest';

const packageJson: PackageJson = JSON.parse(
  fs.readFileSync('package.json').toString()
);

const checkedPackageJson = childProcess.spawnSync('npm', [
  'view',
  `${packageJson.name}@${packageJson.version}`,
]);

if (checkedPackageJson.stdout.toString() !== '') {
  console.log(
    '\nPackage version already exists in npm registry - skip release'
  );
  process.exit(0);
}

if (!packageJson.version) {
  console.log('No version in package.json');
  process.exit(1);
}

const branchName = execSync('git rev-parse --abbrev-ref HEAD')
  .toString('utf-8')
  .trim();

const tag =
  packageJson.version.includes('alpha') && branchName.startsWith('alpha')
    ? 'alpha'
    : packageJson.version.includes('beta') && branchName.startsWith('beta')
      ? 'beta'
      : packageJson.version.includes('canary') &&
          branchName.startsWith('canary')
        ? 'canary'
        : packageJson.version.includes('next') && branchName.startsWith('next')
          ? 'next'
          : packageJson.version.includes('rc') && branchName.startsWith('rc')
            ? 'rc'
            : branchName === 'main'
              ? 'latest'
              : '';

console.log(
  `\n[Success] - Publishing ${packageJson.name}@${packageJson.version} with tag ${tag}`
);
childProcess.execSync(`npm publish --tag ${tag}`);
