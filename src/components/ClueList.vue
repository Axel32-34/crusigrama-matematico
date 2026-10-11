<script setup lang="ts">
import type { CrosswordEntry } from '../types/crossword'

defineProps<{
  entries: CrosswordEntry[]
  activeEntryKey: string | null
}>()

const emit = defineEmits<{
  select: [entry: CrosswordEntry]
}>()

function entryKey(entry: CrosswordEntry) {
  return `${entry.direction}-${entry.number}`
}
</script>

<template>
  <section class="clue-list">
    <div>
      <h2>Horizontales</h2>

      <div class="clues-btns">
        <button
          v-for="entry in entries.filter((e) => e.direction === 'across')"
          :key="entryKey(entry)"
          type="button"
          class="clue"
          :class="{ 'is-active': activeEntryKey === entryKey(entry) }"
          @click="emit('select', entry)"
        >
          <span class="clue-number">{{ entry.number }}.</span>
          <span>{{ entry.clue }}</span>
        </button>
      </div>
    </div>

    <div>
      <h2>Verticales</h2>

      <div class="clues-btns">
        <button
          v-for="entry in entries.filter((e) => e.direction === 'down')"
          :key="entryKey(entry)"
          type="button"
          class="clue"
          :class="{ 'is-active': activeEntryKey === entryKey(entry) }"
          @click="emit('select', entry)"
        >
          <span class="clue-number">{{ entry.number }}.</span>
          <span>{{ entry.clue }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.clue-list {
  display: grid;
  /* grid-template-columns: repeat(2, minmax(0, 1fr)); */
  grid-template-columns: 1fr;
  gap: 24px;
}
.clues-btns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

h2 {
  margin: 0 0 12px;
  font-size: 17px;
}

.clue {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #334155;
  text-align: left;
  font-size: 10px;
  line-height: 1.5;
  cursor: pointer;
}

.clue:hover {
  background: #f1f5f9;
}

.clue.is-active {
  border-color: #93c5fd;
  background: #dbeafe;
  color: #1d4ed8;
}

.clue-number {
  flex: 0 0 auto;
  font-weight: 800;
}

@media (max-width: 600px) {
  .clue-list {
    grid-template-columns: 1fr;
  }
}
</style>
