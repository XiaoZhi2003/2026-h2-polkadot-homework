import fs from 'node:fs'
import path from 'node:path'

const root = path.join(process.cwd(), 'src')
const chinesePattern = /[\u3400-\u9fff\uf900-\ufaff]/

// 只检查组件文件，i18n 中文资源和合约中文注释不属于这个约束范围。
function listVueFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listVueFiles(fullPath)
    return entry.isFile() && entry.name.endsWith('.vue') ? [fullPath] : []
  })
}

function maskComments(text) {
  let output = ''
  let i = 0
  let inHtmlComment = false
  let inBlockComment = false
  let inLineComment = false

  // 把 HTML/JS/CSS 注释都替换成空白，保留换行用于准确报行号。
  while (i < text.length) {
    if (inLineComment) {
      if (text[i] === '\n') {
        inLineComment = false
        output += '\n'
      } else {
        output += ' '
      }
      i += 1
      continue
    }

    if (inHtmlComment) {
      if (text.startsWith('-->', i)) {
        output += '   '
        i += 3
        inHtmlComment = false
      } else {
        output += text[i] === '\n' ? '\n' : ' '
        i += 1
      }
      continue
    }

    if (inBlockComment) {
      if (text.startsWith('*/', i)) {
        output += '  '
        i += 2
        inBlockComment = false
      } else {
        output += text[i] === '\n' ? '\n' : ' '
        i += 1
      }
      continue
    }

    if (text.startsWith('<!--', i)) {
      output += '    '
      i += 4
      inHtmlComment = true
      continue
    }

    if (text.startsWith('/*', i)) {
      output += '  '
      i += 2
      inBlockComment = true
      continue
    }

    if (text.startsWith('//', i)) {
      output += '  '
      i += 2
      inLineComment = true
      continue
    }

    output += text[i]
    i += 1
  }

  return output
}

function locate(text, index) {
  const before = text.slice(0, index)
  const lines = before.split('\n')
  return { line: lines.length, column: lines.at(-1).length + 1 }
}

const failures = []

for (const file of listVueFiles(root)) {
  const text = fs.readFileSync(file, 'utf8')
  const masked = maskComments(text)
  const lines = text.split('\n')

  // 一个字符一个字符扫，方便定位到具体中文残留位置。
  for (let index = 0; index < masked.length; index += 1) {
    if (!chinesePattern.test(masked[index])) continue
    const { line, column } = locate(masked, index)
    failures.push({
      file: path.relative(process.cwd(), file),
      line,
      column,
      text: lines[line - 1]?.trim() ?? '',
    })
  }
}

if (failures.length > 0) {
  console.error('Chinese text found in Vue components outside comments:')
  for (const item of failures) {
    console.error(`${item.file}:${item.line}:${item.column} ${item.text}`)
  }
  process.exit(1)
}

console.log('No Chinese text found in Vue components outside comments.')
