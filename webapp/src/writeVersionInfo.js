const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const process = require('process');
const fs = require('fs');

// CONFIG
const OUTPUT_FILE = 'environments/version.ts';

async function getRev() {
  const {stdout} = await exec('git rev-parse --short HEAD');
  return (stdout || '').trim();
}

async function isDirty() {
  try {
    await exec('git diff-index --quiet HEAD --');
    return false;
  } catch (e) {
    return true;
  }

}

Promise.all([
  getRev(),
  isDirty()
]).then(res => {

  const thisFile = process.argv[1];
  const output = path.join(path.dirname(thisFile), OUTPUT_FILE);

  console.log('Writing revision info to ', output);
  const contentObj = {
    revision: res[0],
    dirty: res[1]
  };
  const content = '// auto generated\n'
    + 'export const versionInfo = ' + JSON.stringify(contentObj);
  fs.writeFileSync(output, content);

});
