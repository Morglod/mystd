const glob = require('glob');
const path = require('path');
const fs = require('fs');

const mds = glob.sync(path.join(__dirname, '../src/**/*.md'));
fs.writeFileSync(
    path.join(__dirname, './_sidebar.md'),
    mds.map(x => ` - [${path.basename(x, '.md')}](${path.relative(__dirname, x)})`).join('\n')
);