import assert from 'node:assert/strict'
import { apiErrorMessage } from '../src/utils/apiError.js'

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

console.log('frontend utility tests passed')
