import fs from 'fs';

import { LocalConfig } from './types';
import { scanOrg } from './index.js';

// This need to change, we risk to expose the auth token
const configFile = fs.readFileSync('config.json', 'utf-8');
const config: LocalConfig = JSON.parse(configFile);

(async () => {
  await scanOrg(config);
})().catch(err => {
  console.error(err);
});
