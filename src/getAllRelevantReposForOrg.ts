const { isStale } = require('./isRepoStale');
const { Octokit } = require('@octokit/rest');
const { GH_AUTHTOKEN, PKG_NAME } = require('../config');

export const getAllRelevantReposForOrg = async (
  org: string,
  daysUntilStale: number,
): Promise<RelevantRepo[] | undefined> => {
  const octokit = new Octokit({
    auth: GH_AUTHTOKEN,
  });

  console.log('Finding Relevant FE repositories for %s...', org.toUpperCase());

  try {
    const allRepos = octokit.paginate.iterator('GET /orgs/:org/repos', {
      org,
      type: 'all',
    });
    const filteredRepos: RelevantRepo[] = [];
    for await (let { data: repos } of allRepos) {
      for (const repo of repos) {
        if (
          repo.archived === false &&
          (repo.language === 'TypeScript' || repo.language === 'JavaScript') &&
          !isStale(repo['pushed_at'], daysUntilStale)
        ) {
          try {
            const packageJsonResponse = await octokit.search.code({
              q: `repo:${org}/${repo.name}+filename:package.json`,
            });
            const foundFiles = packageJsonResponse.data.items;

            for (let i = 0; i < foundFiles.length; i++) {
              const packageJsonFile = foundFiles[i];

              // The search matches package-lock too
              if (packageJsonFile.name === 'package.json') {
                try {
                  const response = await octokit.repos.getContent({
                    owner: org,
                    repo: repo.name,
                    path: packageJsonFile.path,
                  });
                  let pkg = JSON.parse(Buffer.from(response.data.content, response.data.encoding).toString());

                  // TODO check devDependencies and peerDependecies?
                  const libVersion = pkg.dependencies?.[PKG_NAME];
                  if (libVersion) {
                    // console.log(`${repo.name} has ${PKG_NAME}, version ${libVersion}`);
                    filteredRepos.push({
                      name: repo.name,
                      installationPath: packageJsonFile.path,
                      libVersion,
                    });
                  }
                } catch (error) {
                  console.log('Error reading package.json file');
                  console.log(error);
                }
              }
            }
          } catch (error: any | unknown) {
            if (error.response == null) {
              console.log(error);
            } else if (error.response.status === 404) {
              console.log(`[getPackageJson] Processing: ${error?.response?.url} -- No package.json found.`);
            } else {
              console.log(error.response);
            }
          }
        }
      }
    }

    return filteredRepos;
  } catch (error) {
    console.error(`[fn 'getAllRelevantReposForOrg']:`, error);
  }
};
