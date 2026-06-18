<template>
  <section class="panel client-selector">
    <div class="selector-head">
      <div>
        <p class="section-label">TARGET CLIENT</p>
        <h2>选择输出客户端</h2>
      </div>
      <span>{{ clients.length }} 个目标</span>
    </div>

    <div class="client-grid">
      <button
        v-for="client in clients"
        :key="client.id"
        type="button"
        class="client-card"
        :class="{ active: modelValue === client.id }"
        @click="$emit('update:modelValue', client.id)"
      >
        <component :is="client.icon" :size="19" />
        <span>
          <strong>{{ client.name }}</strong>
          <small>{{ client.platform }}</small>
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { Box, Flame, Gem, Monitor, Radio, Rocket, Shield, Smartphone, Sparkles, Waves, Zap } from 'lucide-vue-next'
import { TARGET_DEFINITIONS } from '../../shared/targets.js'

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const clients = TARGET_DEFINITIONS.map(client => ({
  ...client,
  icon: iconFor(client.id)
}))

function iconFor(id) {
  if (['clashmeta', 'mihomo'].includes(id)) return Sparkles
  if (id === 'clash') return Flame
  if (['stash', 'nekobox'].includes(id)) return Box
  if (id === 'singbox') return Radio
  if (id === 'hiddify') return Shield
  if (['surge', 'surfboard'].includes(id)) return Waves
  if (id === 'quantumultx') return Gem
  if (id === 'shadowrocket') return Rocket
  if (id === 'loon') return Zap
  if (['v2rayng', 'sfa', 'sfi'].includes(id)) return Smartphone
  return Monitor
}
</script>

<style scoped>
.client-selector {
  display: grid;
  gap: 14px;
}

.selector-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.selector-head h2 {
  margin: 0;
  color: var(--text);
  font-size: 1.18rem;
}

.selector-head > span {
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 0.78rem;
  font-weight: 900;
}

.client-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(186px, 1fr));
  gap: 10px;
}

.client-card {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 11px;
  min-height: 76px;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text-soft);
  background: rgba(255, 255, 255, 0.035);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

.client-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-1px);
}

.client-card.active {
  border-color: rgba(49, 214, 255, 0.72);
  color: var(--text);
  background: rgba(49, 214, 255, 0.1);
}

.client-card svg {
  color: var(--accent);
}

.client-card span {
  min-width: 0;
}

.client-card strong,
.client-card small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.client-card strong {
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.22;
}

.client-card small {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 0.78rem;
  line-height: 1.35;
}
</style>
