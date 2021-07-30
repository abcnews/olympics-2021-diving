#!/usr/bin/env node

const { spawn } = require('child_process');
const { join } = require('path');
const del = require('del');
const { zip } = require('zip-a-folder');
const { name, version } = require('../package.json');

const PROJECT_PATH = join(__dirname, '..');
const BUILD_PATH = join(PROJECT_PATH, '.build');
const GLOBS_TO_DELETE = ['hero.svg', 'index.html', 'index.html.css', 'scrubby'];

const run = async () => {
  console.log('Bundling for Apple News');
  console.log('> 1. `aunty build --local --id="apple-news"` (NODE_ENV=production, IS_FOR_APPLE_NEWS=yes)');
  await new Promise((resolve, reject) => {
    const aunty = spawn('aunty', ['build', '--local', '--id="apple-news"'], {
      env: { ...process.env, NODE_ENV: 'production', IS_FOR_APPLE_NEWS: 'yes' }
    });

    aunty.on('error', reject);
    aunty.on('close', resolve);
  });
  console.log('> 2. Delete unnecessary files');
  await del(GLOBS_TO_DELETE, { cwd: BUILD_PATH });
  console.log('> 3. Create versioned zipfile');
  await zip(BUILD_PATH, join(PROJECT_PATH, `${name}-${version}-apple-news.zip`));
  console.log('Done');
};

run();
