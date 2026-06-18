const exactMessages = {
  'Invalid subscription URL': '订阅地址格式无效',
  'Subscription URL is required': '请输入订阅地址',
  'Subscription URL must use http or https': '订阅地址必须使用 HTTP 或 HTTPS',
  'Subscription URL credentials are not supported': '订阅地址不支持内嵌用户名或密码',
  'Invalid target client': '不支持所选目标客户端',
  'Invalid export target': '不支持所选导出客户端',
  'Private or local addresses are disabled': '当前服务禁止访问本地或内网订阅地址',
  'Subscription hostname could not be resolved': '无法解析订阅地址的域名',
  'Subscription hostname resolves to a private or local address': '订阅地址解析到了本地或内网地址',
  'No supported nodes found in subscription': '订阅中没有找到支持的节点',
  'No supported nodes found in subscriptions': '订阅中没有找到支持的节点',
  'No nodes can be converted to the selected target client': '没有节点兼容所选客户端',
  'Custom code already exists': '这个自定义短码已存在',
  'Custom code must be 3-32 letters, numbers, underscores, or hyphens': '自定义短码须为 3–32 位字母、数字、下划线或连字符',
  'Invalid URL format': '地址格式无效',
  'Short links only support http or https URLs': '短链接仅支持 HTTP 或 HTTPS 地址',
  'Short link not found': '短链接不存在',
  'Short link storage is unavailable': '短链接存储不可用',
  'API route not found': 'API 路由不存在'
}

const prefixMessages = [
  ['Failed to fetch subscription:', '拉取订阅失败：'],
  ['Failed to parse subscription:', '解析订阅失败：'],
  ['Too many subscription redirects', '订阅重定向次数过多'],
  ['Subscription redirect is missing a location', '订阅重定向缺少目标地址'],
  ['Subscription is larger than', '订阅内容超过大小限制：'],
  ['The operation was aborted due to timeout', '拉取订阅超时'],
  ['Health check failed:', '节点检测失败：'],
  ['Merge failed:', '订阅合并失败：']
]

export function apiErrorMessage(value, fallback = '请求失败') {
  let message = value

  if (value && typeof value === 'object') {
    message = value.message || value.error
  }

  if (typeof message !== 'string' || !message.trim()) return fallback
  message = message.trim()

  try {
    const parsed = JSON.parse(message)
    if (parsed && typeof parsed === 'object') {
      message = parsed.message || parsed.error || message
    }
  } catch {
    // Plain-text API errors are expected.
  }

  if (exactMessages[message]) return exactMessages[message]

  const prefix = prefixMessages.find(([english]) => message.startsWith(english))
  if (prefix) return `${prefix[1]}${message.slice(prefix[0].length).trim()}`

  return message
}
