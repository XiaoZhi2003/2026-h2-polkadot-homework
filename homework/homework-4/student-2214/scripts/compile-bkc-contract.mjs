import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import solc from 'solc'

const require = createRequire(import.meta.url)
const projectRoot = process.cwd()
const contractPath = path.join(projectRoot, 'src/contracts/BKCERC1363Token.sol')
const outputPath = path.join(projectRoot, 'src/contracts/BKCERC1363Token.compiled.js')

const source = fs.readFileSync(contractPath, 'utf8')

// OpenZeppelin 依赖从 node_modules 解析，避免把第三方源码复制进项目。
function findImport(importPath) {
  try {
    const resolvedPath = require.resolve(importPath, { paths: [projectRoot] })
    return { contents: fs.readFileSync(resolvedPath, 'utf8') }
  } catch (error) {
    return { error: `Cannot resolve ${importPath}: ${error.message}` }
  }
}

const input = {
  language: 'Solidity',
  sources: {
    'BKCERC1363Token.sol': { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImport }))
const errors = output.errors ?? []
const fatalErrors = errors.filter(error => error.severity === 'error')

// solc 的 warning 也打印出来，方便发现未来版本兼容问题。
for (const error of errors) {
  console.error(error.formattedMessage)
}

if (fatalErrors.length > 0) {
  process.exit(1)
}

const contract = output.contracts['BKCERC1363Token.sol']?.BKCERC1363Token

if (!contract?.abi || !contract?.evm?.bytecode?.object) {
  throw new Error('solc output did not include ABI and bytecode for BKCERC1363Token')
}

// 生成文件直接给前端 import，部署页不需要再懂 solc artifact 结构。
const artifact = `// 本文件由 scripts/compile-bkc-contract.mjs 生成，请修改 Solidity 源码后重新生成。
export const BKC_TOKEN_ABI = ${JSON.stringify(contract.abi, null, 2)}

export const BKC_TOKEN_BYTECODE = '0x${contract.evm.bytecode.object}'

export const BKC_TOKEN_SOURCE = ${JSON.stringify(source)}
`

fs.writeFileSync(outputPath, artifact, 'utf8')
console.log(`Wrote ${path.relative(projectRoot, outputPath)}`)
