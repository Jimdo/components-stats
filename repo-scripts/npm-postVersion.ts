import fs from 'fs';
import childProcess from 'child_process';
import { PackageJson } from 'type-fest';

// TODO - analyze commits and use commit messages to annotate tag?

const packageJson: PackageJson = JSON.parse(
  fs.readFileSync('package.json').toString()
);

childProcess.execSync(`git push origin v${packageJson.version}`);
