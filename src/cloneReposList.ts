var shell = require('shelljs');
const fs = require('node:fs');

export const cloneReposList = (reposLocalDir: string, repos: RelevantRepo[], org: string) => {
  if (fs.existsSync(reposLocalDir)) {
    // shell.rm('-rf', `${reposLocalDir}/*`);
  } else {
    fs.mkdirSync(reposLocalDir);
  }
  shell.cd(reposLocalDir);

  console.log('Cloning Relevant FE repositories...');

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoURL = `git@github.com:${org}/${repo.name}.git`;

    console.log('Cloning %s into %s', `${org}/${repo.name}`, reposLocalDir);
    const localRepoDir = `${reposLocalDir}/${repo.name}`;
    if (fs.existsSync(localRepoDir)) {
      // FIXME maybe we could clone only new repos and just update what we already have?
      /* shell.cd(localRepoDir);
        if (shell.exec(`git pull origin/main`).code !== 0) {
          console.error('Git pull failed for repo: %s', repo.name);
        } */
    } else {
      if (shell.exec(`git clone ${repoURL}`).code !== 0) {
        console.error('Git clone failed for repo: %s', repo.name);
      }
    }
  }
};
