import {
    TARGET_DEFINITIONS,
    getTargetDefinition,
    normalizeTargetId
} from '../../shared/targets.js'

export const YAML_TARGETS = targetSet('yaml')
export const BASE64_TARGETS = targetSet('base64')
export const SING_BOX_TARGETS = targetSet('json')
export const TEXT_TARGETS = new Set([
    ...targetSet('conf'),
    ...targetSet('text')
])

export const SUPPORTED_TARGETS = new Set(TARGET_DEFINITIONS.map(target => target.id))

export function normalizeTarget(target) {
    return normalizeTargetId(target)
}

export function isSupportedTarget(target) {
    return Boolean(getTargetDefinition(target))
}

export function supportedTargets() {
    return TARGET_DEFINITIONS.map(target => target.id)
}

export function targetDefinitions() {
    return TARGET_DEFINITIONS.map(target => ({
        ...target,
        nodeTypes: [...target.nodeTypes]
    }))
}

export function supportedNodeTypesForTarget(target) {
    return new Set(getTargetDefinition(target)?.nodeTypes || [])
}

export function contentTypeForTarget(target) {
    return getTargetDefinition(target)?.contentType || 'text/plain; charset=utf-8'
}

export function extensionForTarget(target) {
    return getTargetDefinition(target)?.extension || 'txt'
}

function targetSet(format) {
    return new Set(
        TARGET_DEFINITIONS
            .filter(target => target.format === format)
            .map(target => target.id)
    )
}
