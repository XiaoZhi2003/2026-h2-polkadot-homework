import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

test('query script resolves its local chain module when run with node', () => {
  const result = spawnSync('node', ['scripts/query.ts'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      PRIVATE_KEY: `0x${'1'.repeat(64)}`,
      RPC_URL: 'http://127.0.0.1:1',
    },
    encoding: 'utf8',
    timeout: 5_000,
  });

  const output = `${result.stdout}${result.stderr}`;

  assert.equal(
    result.status,
    0,
    `expected query script to handle startup without crashing:\n${output}`,
  );
  assert.doesNotMatch(output, /ERR_MODULE_NOT_FOUND|Cannot find module/);
});
