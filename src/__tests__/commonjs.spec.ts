import fs from 'fs';
import path from 'path';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec);

describe(`commonjs support`, () => {
  const parentDir = path.join(__dirname, `../../.twrnc`);
  let tempDir: string;
  beforeAll(async () => {
    await fs.promises.mkdir(parentDir).catch(() => {
      // Ignore if it already exists
    });

    tempDir = await fs.promises.mkdtemp(path.join(parentDir, `cjs-output`));

    // Compile CommonJS code to a temporary directory in .twrnc
    await exec(`npm run compile:cjs -- --outDir "${tempDir}"`, {
      cwd: path.join(__dirname, `../../`),
    });
  });

  afterAll(async () => {
    // Cleanup compilation output from temp directory
    await fs.promises.rmdir(tempDir, {
      recursive: true,
      // @ts-ignore - Required for Node 12
      force: true,
    });
  });

  test(`\`create\` can be required from node`, async () => {
    await exec(`node -e 'require("${tempDir}/create")'`);
  });
});
