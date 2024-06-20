import fs from 'fs';
import { RelevantRepo } from 'package-adoption';

import shelljsPkg from 'shelljs';
const { cd, exec } = shelljsPkg;

/**
 * It clones all the relevant repos from a given organization into a local directory
 * @param {string} reposLocalDir - The directory where the repos will be cloned to.
 * @param {RelevantRepo[]} repos - An array of relevant repos.
 * @param {string} org - The name of the organization you want to get the stats for.
 */
export const cloneReposList = (
  reposLocalDir: string,
  repos: RelevantRepo[],
  org: string
): void => {
  if (fs.existsSync(reposLocalDir)) {
    // shell.rm('-rf', `${reposLocalDir}/*`);
  } else {
    fs.mkdirSync(reposLocalDir);
  }
  cd(reposLocalDir);

  for (let i = 0; i < repos.length; i++) {
    const repo: RelevantRepo = repos[i];
    const repoURL = `git@github.com:${org}/${repo.name}.git`;

    const localRepoDir = `${reposLocalDir}/${repo.name}`;
    if (fs.existsSync(localRepoDir)) {
      console.log(
        '[components-stats] - %s directory already exists, updating it...',
        `${org}/${repo.name}`
      );

      cd(localRepoDir);
      if (exec('git pull').code !== 0) {
        console.error('Git pull failed for repo: %s', repo.name);
      }
      cd('..');
    } else {
      console.log('[components-stats] - Cloning %s...', `${org}/${repo.name}`);

      if (exec(`git clone ${repoURL}`).code !== 0) {
        console.error(
          '[components-stats] - Git clone failed for repo: %s',
          repo.name
        );
      }
    }
  }
};
