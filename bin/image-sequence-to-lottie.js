#!/usr/bin/env node

const { readdirSync } = require('fs');
const { basename, dirname, join } = require('path');
const { cwd } = require('process');
const calipers = require('calipers');
const writeJsonFile = require('write-json-file');
const { dependencies } = require('../package.json');

const BODYMOVIN_VERSION = dependencies['lottie-web'].replace(/^\^/, '');
const FRAME_RATE = 30.0;
const VALID_IMAGE_FILE_EXTENSIONS = ['jpg', 'png', 'svg'];
const compareNumericValue = (a, b) => a.split('.')[0] - b.split('.')[0];
const Calipers = calipers('jpeg', 'png', 'svg');

async function imageSequenceToLottie(pathFromCWD) {
  const directoryPath = join(cwd(), pathFromCWD);
  const filesInDirectory = readdirSync(directoryPath);
  const fileNames = filesInDirectory
    .filter(name => VALID_IMAGE_FILE_EXTENSIONS.indexOf(name.split('.').reverse()[0]) > -1)
    .sort(compareNumericValue);
  const fileIds = fileNames.map(name => name.split('.')[0]);
  const fileExtensions = fileNames.map(name => name.split('.').reverse()[0]);
  const { width, height } = (await Calipers.measure(join(directoryPath, fileNames[0]))).pages[0];

  const data = {
    ip: 0,
    op: fileNames.length,
    fr: FRAME_RATE,
    w: width,
    h: height,
    v: BODYMOVIN_VERSION,
    nm: pathFromCWD,
    layers: fileNames.map((fileName, index) => ({
      ty: 2,
      ks: {},
      ind: index + 1,
      cl: fileExtensions[index],
      ip: index,
      op: index + 1,
      st: index,
      nm: fileName,
      refId: fileIds[index]
    })),
    assets: fileNames.map((fileName, index) => ({
      h: height,
      w: width,
      id: fileIds[index],
      p: fileName,
      u: '' // '.' ?
    }))
  };

  await writeJsonFile(join(directoryPath, 'data.json'), data, { indent: undefined });
}

imageSequenceToLottie(process.argv[2]);
