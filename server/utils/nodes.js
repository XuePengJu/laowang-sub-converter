import { addEmoji } from './parsers.js'

export function boolOption(value, defaultValue = false) {
    if (typeof value === 'boolean') return value
    if (value === undefined || value === null || value === '') return defaultValue
    return !['0', 'false', 'no', 'off'].includes(String(value).trim().toLowerCase())
}

export function splitKeywords(value) {
    return String(value || '')
        .split('|')
        .map(keyword => keyword.trim())
        .filter(Boolean)
}

export function applyNodeOptions(nodes, options = {}) {
    let output = [...nodes]

    const includeKeywords = splitKeywords(options.include)
    if (includeKeywords.length) {
        output = output.filter(node => {
            const name = String(node.name || '').toLocaleLowerCase()
            return includeKeywords.some(keyword => name.includes(keyword.toLocaleLowerCase()))
        })
    }

    const excludeKeywords = splitKeywords(options.exclude)
    if (excludeKeywords.length) {
        output = output.filter(node => {
            const name = String(node.name || '').toLocaleLowerCase()
            return !excludeKeywords.some(keyword => name.includes(keyword.toLocaleLowerCase()))
        })
    }

    if (boolOption(options.sort, false)) {
        output.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (boolOption(options.emoji, true)) {
        output = output.map(node => ({ ...node, name: addEmoji(node.name) }))
    }

    if (options.rename) {
        output = renameNodes(output, options.rename)
    }

    return output
}

export function dedupeNodes(nodes) {
    const seen = new Set()
    return nodes.filter(node => {
        const key = stableStringify(
            Object.fromEntries(Object.entries(node).filter(([key]) => key !== 'name'))
        )
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

export function renameNodes(nodes, renameRules) {
    const rules = String(renameRules || '')
        .split('\n')
        .filter(rule => rule.includes('->'))

    if (!rules.length) return nodes

    return nodes.map(node => {
        let name = node.name
        for (const rule of rules) {
            const [from, to = ''] = rule.split('->')
            const source = from.trim()
            if (source) name = name.split(source).join(to.trim())
        }
        return { ...node, name }
    })
}

function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
    if (!value || typeof value !== 'object') return JSON.stringify(value)
    return `{${Object.keys(value)
        .sort()
        .map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
        .join(',')}}`
}
