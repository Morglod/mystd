const glob = require('glob');
const path = require('path');
const fs = require('fs');

const header = '', footer = '';

const rootDir = path.join(__dirname, '../src');
const mds = glob.sync(path.join(rootDir, '/**/*.md'));

const getLinkName = (filepath) => path.relative(rootDir, filepath).slice(0, -3);
const refs = mds.map(x => ` - [${getLinkName(x)}](${path.relative(__dirname, x)})`).join('\n');

fs.writeFileSync(
    path.join(__dirname, './reference.md'),
    header + refs + footer,
);