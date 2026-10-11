<template>
  <div class="game-status">
    <div class="progress-header">
      <span>Progreso</span>
      <strong>{{ completedCount }} de {{ entries.length }} palabras</strong>
    </div>

    <div
      class="progress-track"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Progreso del crucigrama"
    >
      <div class="progress-fill" :style="{ width: `${progress}%` }" />
    </div>
    <div>
      <p v-if="showResults" class="result-message" role="status">
        <template v-if="completedCount === entries.length">
          ¡Excelente! Completaste el crucigrama correctamente.
        </template>

        <template v-else>
          Tienes {{ completedCount }} de {{ entries.length }}
          palabras correctas. Revisa las que te faltan.
        </template>
      </p>
    </div>

    <div class="controls">
      <button type="button" class="check-button" @click="checkAnswers">Comprobar respuestas</button>

      <slot name="extra-controls" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  entries: { number: number; word: string; direction: string; row: number; col: number }[]
  completedCount: number
  checkAnswers: () => void
  showResults: boolean
}>()

const progress = computed(() =>
  props.entries.length === 0 ? 0 : Math.round((props.completedCount / props.entries.length) * 100),
)
</script>
<style scoped>
.game-status {
  width: 100%;
  /* max-width: 520px; */
  margin: 20px auto 20px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  color: #475569;
  font-size: 13px;
}

.progress-track {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #2563eb;
  transition: width 200ms ease;
}

.check-button {

  margin-top: 16px;
  padding: 12px 16px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.check-button:hover {
  background: #1d4ed8;
}

.result-message {
  margin: 12px 0 0;
  color: #334155;
  font-size: 14px;
  line-height: 1.5;
}
.controls {
  display: grid;
   grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 12px;
}
</style>
