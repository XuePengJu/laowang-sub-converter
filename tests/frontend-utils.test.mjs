import assert from 'node:assert/strict'
import fs from 'node:fs'
import { apiErrorMessage } from '../src/utils/apiError.js'
import { copyText } from '../src/utils/clipboard.js'
import { downloadBlob } from '../src/utils/download.js'

assert.equal(apiErrorMessage('Invalid subscription URL'), '订阅地址格式无效')
assert.equal(
    apiErrorMessage({ error: 'Conversion failed', message: 'Invalid subscription URL' }),
    '订阅地址格式无效'
)
assert.equal(
    apiErrorMessage('{"error":"Custom code already exists"}'),
    '这个自定义短码已存在'
)
assert.equal(
    apiErrorMessage({ error: 'Failed to fetch subscription: HTTP 403' }),
    '拉取订阅失败：HTTP 403'
)
assert.equal(apiErrorMessage(new Error('Invalid target client')), '不支持所选目标客户端')
assert.equal(apiErrorMessage('', '自定义失败提示'), '自定义失败提示')
assert.equal(apiErrorMessage('Unmapped upstream detail'), 'Unmapped upstream detail')

let clipboardValue = ''
Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
        clipboard: {
            writeText: async value => {
                clipboardValue = value
            }
        }
    }
})
await copyText('secure-copy')
assert.equal(clipboardValue, 'secure-copy')

let fallbackValue = ''
const fallbackElement = {
    value: '',
    style: {},
    setAttribute() {},
    select() {
        fallbackValue = this.value
    },
    remove() {}
}
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} })
Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
        body: { appendChild() {} },
        createElement: () => fallbackElement,
        execCommand: command => command === 'copy'
    }
})
await copyText('http-copy')
assert.equal(fallbackValue, 'http-copy')

let appended = false
let clickedWhileAttached = false
let removed = false
let revokedUrl = ''
const downloadElement = {
    href: '',
    download: '',
    rel: '',
    style: {},
    click() {
        clickedWhileAttached = appended
    },
    remove() {
        removed = true
        appended = false
    }
}

Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
        body: {
            appendChild(element) {
                assert.equal(element, downloadElement)
                appended = true
            }
        },
        createElement: tag => {
            assert.equal(tag, 'a')
            return downloadElement
        }
    }
})
const originalURL = globalThis.URL
Object.defineProperty(globalThis, 'URL', {
    configurable: true,
    value: {
        createObjectURL(blob) {
            assert.equal(blob.size, 6)
            return 'blob:download-test'
        },
        revokeObjectURL(url) {
            revokedUrl = url
        }
    }
})
const originalSetTimeout = globalThis.setTimeout
Object.defineProperty(globalThis, 'setTimeout', {
    configurable: true,
    value: callback => {
        callback()
        return 0
    }
})

downloadBlob(new Blob(['config']), 'config.yaml')
assert.equal(downloadElement.href, 'blob:download-test')
assert.equal(downloadElement.download, 'config.yaml')
assert.equal(downloadElement.rel, 'noopener')
assert.equal(downloadElement.style.display, 'none')
assert.equal(clickedWhileAttached, true)
assert.equal(removed, true)
assert.equal(revokedUrl, 'blob:download-test')
Object.defineProperty(globalThis, 'URL', { configurable: true, value: originalURL })
Object.defineProperty(globalThis, 'setTimeout', { configurable: true, value: originalSetTimeout })

const healthView = fs.readFileSync(new URL('../src/views/HealthCheck.vue', import.meta.url), 'utf8')
assert.match(healthView, /currentFilter\.value = 'all'/, 'health checks should reset stale result filters')

console.log('frontend utility tests passed')
