<template>
  <main class="page">
    <section class="page-shell stack">
      <section class="converter-hero hero-surface">
        <div>
          <p class="section-label">CONVERSION PIPELINE</p>
          <h1 class="title-xl">生成客户端可直接导入的订阅配置</h1>
          <p class="subtitle">
            输入订阅地址，选择目标客户端，系统会按协议兼容性输出 YAML、CONF、JSON 或分享链接。
          </p>
        </div>
        <div class="status-pill">API 在线</div>
      </section>

      <section class="pipeline">
        <article v-for="step in steps" :key="step.id" class="step-card" :class="{ active: step.active }">
          <span>{{ step.id }}</span>
          <strong>{{ step.title }}</strong>
          <small>{{ step.desc }}</small>
        </article>
      </section>

      <section class="panel source-panel">
        <div class="source-head">
          <div>
            <p class="section-label">SOURCE</p>
            <h2>订阅来源</h2>
          </div>
          <span class="mono">当前服务 API</span>
        </div>

        <label class="field">
          <span>订阅地址</span>
          <textarea
            class="textarea mono"
            v-model="subscriptionUrl"
            placeholder="https://example.com/subscription?token=..."
            rows="5"
          ></textarea>
        </label>

      </section>

      <ClientSelector v-model="selectedClient" />

      <AdvancedOptions
        :model-value="advancedOptions"
        :rule-preset-enabled="supportsRulePreset"
        @update:model-value="updateAdvancedOptions"
      />

      <section class="panel action-panel">
        <div>
          <p class="section-label">EXECUTE</p>
          <h2>输出任务</h2>
          <p>
            当前目标：<strong>{{ selectedClient }}</strong>，规则模板：
            <strong>{{ supportsRulePreset ? (advancedOptions.rulePreset || 'basic') : '不适用' }}</strong>
          </p>
        </div>
        <div class="action-buttons">
          <button class="btn btn-primary" type="button" @click="convertSubscription" :disabled="!canConvert || loading">
            <Loader2 v-if="loading" :size="18" class="spin" />
            <RefreshCw v-else :size="18" />
            <span>{{ loading ? '生成中' : '生成订阅链接' }}</span>
          </button>
          <button class="btn btn-secondary" type="button" @click="resetForm">
            <RotateCcw :size="18" />
            <span>重置</span>
          </button>
        </div>
      </section>

      <ResultPanel v-if="convertedUrl" :result="convertedUrl" />
      <p v-if="error" class="alert alert-error">{{ error }}</p>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Loader2, RefreshCw, RotateCcw } from 'lucide-vue-next'
import ClientSelector from '../components/ClientSelector.vue'
import AdvancedOptions from '../components/AdvancedOptions.vue'
import ResultPanel from '../components/ResultPanel.vue'
import { getTargetDefinition } from '../../shared/targets.js'
import { apiErrorMessage } from '../utils/apiError.js'

const subscriptionUrl = ref('')
const selectedClient = ref('clashmeta')
const loading = ref(false)
const convertedUrl = ref('')
const error = ref('')

const advancedOptions = reactive({
  emoji: true,
  udp: true,
  skipCert: false,
  sort: false,
  filter: '',
  exclude: '',
  rename: '',
  rulePreset: 'standard'
})

const canConvert = computed(() => subscriptionUrl.value.trim() && selectedClient.value)
const supportsRulePreset = computed(() => getTargetDefinition(selectedClient.value)?.format === 'yaml')

const steps = computed(() => [
  { id: '01', title: '输入来源', desc: subscriptionUrl.value.trim() ? '已填写订阅地址' : '等待订阅地址', active: Boolean(subscriptionUrl.value.trim()) },
  { id: '02', title: '选择目标', desc: selectedClient.value || '选择客户端', active: Boolean(selectedClient.value) },
  { id: '03', title: '生成导入', desc: convertedUrl.value ? '输出已就绪' : '等待执行', active: Boolean(convertedUrl.value) }
])

const updateAdvancedOptions = value => {
  Object.assign(advancedOptions, value || {})
}

const convertSubscription = async () => {
  if (!canConvert.value) return
  loading.value = true
  error.value = ''
  convertedUrl.value = ''

  try {
    const params = new URLSearchParams({
      target: selectedClient.value,
      url: subscriptionUrl.value.trim(),
      emoji: advancedOptions.emoji ? '1' : '0',
      udp: advancedOptions.udp ? '1' : '0',
      scert: advancedOptions.skipCert ? '1' : '0',
      sort: advancedOptions.sort ? '1' : '0'
    })

    if (advancedOptions.filter) params.append('include', advancedOptions.filter)
    if (advancedOptions.exclude) params.append('exclude', advancedOptions.exclude)
    if (advancedOptions.rename) params.append('rename', advancedOptions.rename)
    if (supportsRulePreset.value && advancedOptions.rulePreset) {
      params.append('rulePreset', advancedOptions.rulePreset)
    }

    const candidateUrl = `${window.location.origin}/api/convert?${params.toString()}`
    const response = await fetch(candidateUrl)
    if (!response.ok) {
      const contentType = response.headers.get('content-type') || ''
      const detail = contentType.includes('application/json')
        ? await response.json()
        : await response.text()
      throw new Error(apiErrorMessage(detail, `转换失败（HTTP ${response.status}）`))
    }
    const output = await response.text()
    if (!output.trim()) throw new Error('目标客户端没有可输出的兼容节点')
    convertedUrl.value = candidateUrl
  } catch (err) {
    error.value = apiErrorMessage(err, '转换失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  subscriptionUrl.value = ''
  selectedClient.value = 'clashmeta'
  convertedUrl.value = ''
  error.value = ''
  Object.assign(advancedOptions, {
    emoji: true,
    udp: true,
    skipCert: false,
    sort: false,
    filter: '',
    exclude: '',
    rename: '',
    rulePreset: 'standard'
  })
}
</script>

<style scoped>
.converter-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.pipeline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.step-card {
  display: grid;
  gap: 6px;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(12, 17, 24, 0.72);
}

.step-card.active {
  border-color: var(--line-strong);
  background: rgba(49, 214, 255, 0.08);
}

.step-card span {
  color: var(--accent);
  font-family: var(--mono);
  font-size: 0.78rem;
  font-weight: 900;
}

.step-card strong {
  color: var(--text);
}

.step-card small {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.source-panel,
.action-panel {
  display: grid;
  gap: 14px;
}

.source-head,
.action-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.source-head h2,
.action-panel h2 {
  margin: 0;
  color: var(--text);
  font-size: 1.18rem;
}

.source-head > span {
  color: var(--accent-2);
  font-size: 0.82rem;
  font-weight: 900;
}

.api-grid,
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.api-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text-soft);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  font-weight: 900;
}

.api-chip.active,
.api-chip:hover {
  border-color: var(--line-strong);
  color: var(--accent);
  background: rgba(49, 214, 255, 0.08);
}

.action-panel p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.action-panel strong {
  color: var(--text-soft);
}

@media (max-width: 780px) {
  .converter-hero,
  .source-head,
  .action-panel {
    flex-direction: column;
  }

  .pipeline {
    grid-template-columns: 1fr;
  }
}
</style>
