<script setup lang="ts">
import { ref } from 'vue'
import GameStatus from './components/GameStatus.vue'
import CrosswordGrid from './components/CrosswordGrid.vue'
import ClueList from './components/ClueList.vue'
import { buildCrossword } from './data/crossword'
import type { CrosswordEntry } from './types/crossword'

const crossword = buildCrossword()

console.table(
  crossword.entries.map((entry) => ({
    numero: entry.number,
    palabra: entry.word,
    direccion: entry.direction,
    fila: entry.row,
    columna: entry.col,
  })),
)

console.info(`Palabras colocadas: ${crossword.entries.length} de 12`)
const showResults = ref(false)
const completedCount = ref(0)

function checkAnswers() {
  showResults.value = true
}
const activeEntryKey = ref<string | null>(null)

function entryKey(entry: CrosswordEntry) {
  return `${entry.direction}-${entry.number}`
}

function selectEntry(entry: CrosswordEntry) {
  activeEntryKey.value = entryKey(entry)
}

const gameVersion = ref(0)

function resetGame() {
  gameVersion.value++
  activeEntryKey.value = null
}

if (import.meta.env.DEV) {
  Object.assign(window, { crossword })
}
</script>

<template>
  <main class="page">
    <header class="page-header">
      <p class="eyebrow">CÁLCULO DIFERENCIAL · JUEGO EDUCATIVO</p>
      <h1>Crucigrama matemático</h1>
      <p>Descubre los conceptos de funciones matemáticas resolviendo las pistas.</p>
      <div class="contributors-section">
        <p>Integrantes del equipo:</p>
        <ul class="contributors">
          <li>Jiménez Paz Axel Enrique</li>
          <li>Sánchez Borrallas Roberto Yusvani</li>
          <li>Figueroa González Fernando Gael</li>
          <li>Gómez Robles Alejandro</li>
        </ul>
      </div>
    </header>
    <section class="game-controls">
      <GameStatus
        :showResults="showResults"
        :entries="crossword.entries"
        :completedCount="completedCount"
        :checkAnswers="checkAnswers"
      >
        <template #extra-controls>
          <button class="reset-button" @click="resetGame">Reiniciar crucigrama</button>
        </template>
      </GameStatus>
    </section>
    <section class="game-layout">
      <div class="board-panel">
        <h2>Completa las palabras</h2>

        <CrosswordGrid
          :key="gameVersion"
          :grid="crossword.grid"
          :entries="crossword.entries"
          :rows="crossword.rows"
          :cols="crossword.cols"
          :active-entry-key="activeEntryKey"
          @select-entry="selectEntry"
          :showResults="showResults"
          @update-completed-count="completedCount = $event"
          @check-answers="checkAnswers"
          @reset-results="showResults = false"
        />

        <p class="helper-text">
          Selecciona una casilla y escribe con el teclado. Haz clic de nuevo en una intersección
          para cambiar entre horizontal y vertical.
        </p>
      </div>

      <aside class="clues-panel">
        <ClueList
          :entries="crossword.entries"
          :active-entry-key="activeEntryKey"
          @select="selectEntry"
        />
      </aside>
    </section>

    <footer></footer>
  </main>
</template>

<style>
:root {
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  color: #172033;
  background: #f5f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button {
  font: inherit;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  margin-bottom: 28px;
}

.eyebrow {
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

h1 {
  margin: 8px 0;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -1px;
}

.page-header > p:last-child {
  color: #64748b;
  line-height: 1.6;
}

.game-layout {
  display: grid;

  /* grid-template-columns: minmax(0, 1fr) minmax(300px, 0.4fr); */
  grid-template-columns: 1fr;

  gap: 24px;
  align-items: start;
}

.board-panel,
.clues-panel {
  min-width: 0;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 16px rgb(15 23 42 / 4%);
}

.board-panel > h2 {
  margin-top: 0;
  font-size: 18px;
}

.helper-text {
  margin: 20px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

footer {
  padding-top: 28px;
  color: #94a3b8;
  font-size: 16px;
  /* text-align: center; */
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: start;
}

@media (max-width: 850px) {
  .game-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 24px 12px;
  }

  .board-panel,
  .clues-panel {
    padding: 16px 10px;
  }
}
.reset-button {
  margin-top: 16px;

  padding: 12px 16px;

  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
}

.reset-button:hover {
  background: #f1f5f9;
}

.game-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.contributors-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}
.contributors {
  font-size: 16px;
}
</style>
