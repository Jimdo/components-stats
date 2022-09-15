var shell = require('shelljs');
const fs = require('node:fs');
import { RelevantRepo } from 'package-adoption';

export const cloneReposList = (reposLocalDir: string, repos: RelevantRepo[], org: string) => {
  if (fs.existsSync(reposLocalDir)) {
    // shell.rm('-rf', `${reposLocalDir}/*`);
  } else {
    fs.mkdirSync(reposLocalDir);
  }
  shell.cd(reposLocalDir);

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoURL = `git@github.com:${org}/${repo.name}.git`;

    const localRepoDir = `${reposLocalDir}/${repo.name}`;
    if (fs.existsSync(localRepoDir)) {
      console.log('[components-stats] - %s directory already exists, updating it...', `${org}/${repo.name}`);

      shell.cd(localRepoDir);
      if (shell.exec(`git pull`).code !== 0) {
        console.error('Git pull failed for repo: %s', repo.name);
      }
      shell.cd('..');
    } else {
      console.log('[components-stats] - Cloning %s...', `${org}/${repo.name}`);

      if (shell.exec(`git clone ${repoURL}`).code !== 0) {
        console.error('[components-stats] - Git clone failed for repo: %s', repo.name);
      }
    }
  }
};
