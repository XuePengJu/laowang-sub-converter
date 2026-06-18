const ALL_TYPES = [
    'ss',
    'ssr',
    'vmess',
    'vless',
    'trojan',
    'hysteria',
    'hysteria2',
    'tuic',
    'snell',
    'http',
    'socks5',
    'anytls'
]

const MIHOMO_TYPES = [...ALL_TYPES]
const SING_BOX_TYPES = ALL_TYPES.filter(type => !['ssr', 'snell'].includes(type))
const SURGE_TYPES = ['ss', 'vmess', 'trojan', 'hysteria2', 'tuic', 'snell', 'http', 'socks5', 'anytls']
const SURFBOARD_TYPES = ['ss', 'vmess', 'trojan', 'hysteria2', 'snell', 'http', 'socks5', 'anytls']
const QUANTUMULT_X_TYPES = ['ss', 'vmess', 'vless', 'trojan', 'http', 'socks5', 'anytls']
const LOON_TYPES = ['ss', 'ssr', 'vmess', 'vless', 'trojan', 'hysteria2', 'http', 'socks5', 'anytls']

export const TARGET_DEFINITIONS = [
    target('clashmeta', 'Clash Meta', 'Meta YAML / 推荐', 'yaml', MIHOMO_TYPES),
    target('mihomo', 'Mihomo', 'Meta 内核 YAML', 'yaml', MIHOMO_TYPES),
    target('stash', 'Stash', 'iOS / macOS YAML', 'yaml', MIHOMO_TYPES),
    target('clash', 'Clash', '经典 YAML', 'yaml', ['ss', 'ssr', 'vmess', 'trojan', 'http', 'socks5']),
    target('clashverge', 'Clash Verge', '桌面客户端', 'yaml', MIHOMO_TYPES),
    target('clashnyanpasu', 'Clash Nyanpasu', '桌面客户端', 'yaml', MIHOMO_TYPES),
    target('flclash', 'FlClash', 'Flutter 客户端', 'yaml', MIHOMO_TYPES),
    target('singbox', 'sing-box', '通用 JSON 配置', 'json', SING_BOX_TYPES),
    target('hiddify', 'Hiddify', 'sing-box JSON', 'json', SING_BOX_TYPES),
    target('nekobox', 'NekoBox', 'Android JSON', 'json', SING_BOX_TYPES),
    target('sfa', 'SFA', 'Android sing-box', 'json', SING_BOX_TYPES),
    target('sfi', 'SFI', 'iOS sing-box', 'json', SING_BOX_TYPES),
    target('sfm', 'SFM', 'macOS sing-box', 'json', SING_BOX_TYPES),
    target('surge', 'Surge', 'iOS / macOS CONF', 'conf', SURGE_TYPES),
    target('surfboard', 'Surfboard', 'Android CONF', 'conf', SURFBOARD_TYPES),
    target('quantumultx', 'Quantumult X', 'iOS 配置片段', 'text', QUANTUMULT_X_TYPES),
    target('loon', 'Loon', 'iOS CONF', 'conf', LOON_TYPES),
    target('shadowrocket', 'Shadowrocket', 'Base64 分享链接', 'base64', ALL_TYPES.filter(type => type !== 'hysteria')),
    target('v2rayn', 'V2RayN', 'Windows 分享链接', 'base64', ['ss', 'vmess', 'vless', 'trojan', 'hysteria2', 'tuic', 'http', 'socks5', 'anytls']),
    target('v2rayng', 'V2RayNG', 'Android 分享链接', 'base64', ['ss', 'vmess', 'vless', 'trojan', 'http', 'socks5']),
    target('v2rayu', 'V2RayU', 'macOS 分享链接', 'base64', ['ss', 'vmess'])
]

export const TARGET_ALIASES = {
    'clash-verge': 'clashverge',
    'clash-nyanpasu': 'clashnyanpasu',
    'sing-box': 'singbox'
}

export function normalizeTargetId(value) {
    const id = String(value || '').trim().toLowerCase()
    return TARGET_ALIASES[id] || id
}

export function getTargetDefinition(value) {
    const id = normalizeTargetId(value)
    return TARGET_DEFINITIONS.find(item => item.id === id) || null
}

function target(id, name, platform, format, nodeTypes) {
    const extension = format === 'yaml' ? 'yaml'
        : format === 'json' ? 'json'
            : format === 'conf' ? 'conf'
                : 'txt'
    const contentType = format === 'yaml' ? 'text/yaml; charset=utf-8'
        : format === 'json' ? 'application/json; charset=utf-8'
            : 'text/plain; charset=utf-8'

    return Object.freeze({
        id,
        name,
        platform,
        format,
        extension,
        contentType,
        nodeTypes: Object.freeze([...nodeTypes])
    })
}
