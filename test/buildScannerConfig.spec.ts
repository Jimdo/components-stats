import { buildScannerConfig } from '../src/buildScannerConfig';
import { REPORTS_OUTPUT_DIR_PREFIX, REPOS_LOCAL_DIR } from '../src/constants';
import path from 'path';

const relevantRepo = {
  name: 'repoName',
  installationPath: 'root',
  libVersion: '0.0.0',
};
const relevantRepoWithSubdirInstallation = {
  name: 'repoName',
  installationPath: 'package',
  libVersion: '0.0.0',
};
const reportsOutputDir = `${REPORTS_OUTPUT_DIR_PREFIX}myPkg`;
const expectedOutputNoComponents = {
  crawlFrom: path.join(REPOS_LOCAL_DIR, relevantRepo.name),
  includeSubComponents: true,
  importedFrom: 'myPkg',
  processors: [
    [
      'count-components-and-props',
      {
        outputTo: path.join(
          reportsOutputDir,
          `scanner-report_${relevantRepo.name}.json`
        ),
      },
    ],
  ],
};

describe('buildScannerConfig', () => {
  it('should return scanner config object', () => {
    const result = buildScannerConfig(relevantRepo, 'myPkg', reportsOutputDir);

    expect(result).toEqual(expectedOutputNoComponents);
  });

  it('should return scanner config object with components', () => {
    const result = buildScannerConfig(relevantRepo, 'myPkg', reportsOutputDir, {
      Accordion: true,
    });

    expect(result).toEqual({
      ...expectedOutputNoComponents,
      components: { Accordion: true },
    });
  });

  it('should return scanner config object for repository subdir', () => {
    const result = buildScannerConfig(
      relevantRepoWithSubdirInstallation,
      'myPkg',
      reportsOutputDir
    );

    const expectedOutputRepoWithSubdir = {
      crawlFrom: path.join(
        REPOS_LOCAL_DIR,
        relevantRepoWithSubdirInstallation.name,
        relevantRepoWithSubdirInstallation.installationPath
      ),
      includeSubComponents: true,
      importedFrom: 'myPkg',
      processors: [
        [
          'count-components-and-props',
          {
            outputTo: path.join(
              reportsOutputDir,
              `scanner-report_${relevantRepoWithSubdirInstallation.name}_${relevantRepoWithSubdirInstallation.installationPath}.json`
            ),
          },
        ],
      ],
    };

    expect(result).toEqual(expectedOutputRepoWithSubdir);
  });
});
