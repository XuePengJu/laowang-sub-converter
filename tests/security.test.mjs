import assert from 'node:assert/strict'
import { isPrivateHostname, normalizeSubscriptionUrl } from '../server/utils/subscription.js'

for (const host of [
    'localhost',
    'api.localhost',
    '127.0.0.1',
    '10.0.0.1',
    '100.64.0.1',
    '169.254.1.1',
    '172.16.0.1',
    '192.168.0.1',
    '::',
    '::1',
    'fc00::1',
    'fd12::1',
    'fe80::1',
    'ff02::1',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
    '0:0:0:0:0:ffff:7f00:1'
]) {
    assert.equal(isPrivateHostname(host), true, `${host} must be blocked`)
}

for (const host of [
    '1.1.1.1',
    '8.8.8.8',
    '::ffff:8.8.8.8',
    '2606:4700:4700::1111',
    '2001:4860:4860::8888'
]) {
    assert.equal(isPrivateHostname(host), false, `${host} should remain public`)
}

assert.equal(normalizeSubscriptionUrl('https://example.com/sub').protocol, 'https:')
assert.throws(() => normalizeSubscriptionUrl('file:///etc/passwd'), /http or https/)
assert.throws(() => normalizeSubscriptionUrl('https://user:pass@example.com/sub'), /credentials/)

console.log('security tests passed')
