<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CrosswordEntry, CrosswordGrid as GridMap } from '../types/crossword'
import { cellKey } from '../data/crossword'

const props = defineProps<{
  grid: GridMap
  entries: CrosswordEntry[]
  rows: number
  cols: number
  activeEntryKey: string | null
  showResults: boolean
}>()

const emit = defineEmits<{
  selectEntry: [entry: CrosswordEntry]
  updateCompletedCount: [count: number]
  checkAnswers: []
    resetResults: []
}>()

function entryKey(entry: CrosswordEntry) {
  return `${entry.direction}-${entry.number}`
}
const letters = ref<Record<string, string>>({})
const selected = ref<string | null>(null)
const activeDirection = ref<'across' | 'down'>('across')

// const showResults = ref(false)

function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
}

function isWordCorrect(entry: CrosswordEntry): boolean {
  const dr = entry.direction === 'down' ? 1 : 0
  const dc = entry.direction === 'across' ? 1 : 0

  const answer = Array.from({ length: entry.word.length }, (_, i) => {
    const row = entry.row + dr * i
    const col = entry.col + dc * i

    return letters.value[cellKey(row, col)] ?? ''
  }).join('')

  return normalizeAnswer(answer) === normalizeAnswer(entry.word)
}

const correctEntries = computed(() => props.entries.filter(isWordCorrect))

const completedCount = computed(() => correctEntries.value.length)

watch(
  completedCount,
  (count) => emit('updateCompletedCount', count),
  { immediate: true },
)



function cellResult(id: string): 'correct' | 'incorrect' | '' {
  if (!props.showResults) return ''

  const belongsTo = props.entries.filter((entry) => {
    const dr = entry.direction === 'down' ? 1 : 0
    const dc = entry.direction === 'across' ? 1 : 0

    return Array.from({ length: entry.word.length }, (_, i) =>
      cellKey(entry.row + dr * i, entry.col + dc * i),
    ).includes(id)
  })

  if (belongsTo.length === 0) return ''

  return belongsTo.every(isWordCorrect) ? 'correct' : 'incorrect'
}

const cells = computed(() => {
  const result: {
    id: string
    row: number
    col: number
    number?: number
  }[] = []

  for (let row = 0; row < props.rows; row++) {
    for (let col = 0; col < props.cols; col++) {
      const id = cellKey(row, col)
      const cell = props.grid.get(id)

      result.push({
        id,
        row,
        col,
        number: cell?.number,
      })
    }
  }

  return result
})

const activeEntry = computed(() => {
  if (!selected.value) return null

  const cell = props.grid.get(selected.value)
  if (!cell) return null

  const matches = props.entries.filter((entry) => {
    const length = entry.word.length
    const isAcross =
      entry.direction === 'across' &&
      cell.row === entry.row &&
      cell.col >= entry.col &&
      cell.col < entry.col + length

    const isDown =
      entry.direction === 'down' &&
      cell.col === entry.col &&
      cell.row >= entry.row &&
      cell.row < entry.row + length

    return isAcross || isDown
  })

  return matches.find((entry) => entry.direction === activeDirection.value) ?? matches[0] ?? null
})

const activeCells = computed(() => {
  if (!activeEntry.value) return []

  return Array.from({ length: activeEntry.value.word.length }, (_, i) =>
    cellKey(
      activeEntry.value!.row + (activeEntry.value!.direction === 'down' ? i : 0),
      activeEntry.value!.col + (activeEntry.value!.direction === 'across' ? i : 0),
    ),
  )
})

watch(
  () => props.activeEntryKey,
  (key) => {
    if (!key) return

    const entry = props.entries.find((item) => entryKey(item) === key)

    if (!entry) return

    activeDirection.value = entry.direction
    selected.value = cellKey(entry.row, entry.col)
  },
  { immediate: true },
)

function selectCell(id: string) {
  if (!props.grid.has(id)) return

  if (selected.value === id) {
    const alternatives = props.entries.filter((entry) => {
      const cell = props.grid.get(id)!
      const rowEnd = entry.row + (entry.direction === 'down' ? entry.word.length - 1 : 0)
      const colEnd = entry.col + (entry.direction === 'across' ? entry.word.length - 1 : 0)

      return (
        cell.row >= entry.row && cell.row <= rowEnd && cell.col >= entry.col && cell.col <= colEnd
      )
    })

    const other = alternatives.find((entry) => entry.direction !== activeDirection.value)

    if (other) activeDirection.value = other.direction
    return
  }

  selected.value = id

  const entry = activeEntry.value

  if (entry) {
    activeDirection.value = entry.direction
    emit('selectEntry', entry)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!selected.value || !activeEntry.value) return

  if (/^[a-záéíóúüñ]$/i.test(event.key)) {
    event.preventDefault()
    letters.value[selected.value] = event.key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
    // props.showResults.value = false
    emit('resetResults')
    move(1)
    return
  }

  if (event.key === 'Backspace') {
    event.preventDefault()

    if (letters.value[selected.value]) {
      delete letters.value[selected.value]
    } else {
      move(-1)
      if (selected.value) delete letters.value[selected.value]
    }
    return
  }

  if (event.key === 'ArrowRight') move(1, 'across')
  if (event.key === 'ArrowLeft') move(-1, 'across')
  if (event.key === 'ArrowDown') move(1, 'down')
  if (event.key === 'ArrowUp') move(-1, 'down')
}

function move(step: number, direction = activeDirection.value) {
  const entry = activeEntry.value
  if (!entry) return

  const index = activeCells.value.indexOf(selected.value!)
  const next = activeCells.value[index + step]

  if (next) {
    selected.value = next
    activeDirection.value = direction
  }
}
</script>

<template>
  <div
    class="crossword-board"
    tabindex="0"
    aria-label="Cuadrícula del crucigrama. Usa el teclado para escribir."
    @keydown="handleKeydown"
  >
    <div
      class="crossword-grid"
      :style="{
        gridTemplateColumns: `repeat(${cols}, 38px)`,
      }"
    >
      <button
        v-for="cell in cells"
        :key="cell.id"
        type="button"
        class="crossword-cell"
        :class="{
          'is-blocked': !grid.has(cell.id),
          'is-active': activeCells.includes(cell.id),
          'is-selected': selected === cell.id,
          'is-correct': cellResult(cell.id) === 'correct',
          'is-incorrect': cellResult(cell.id) === 'incorrect',
        }"
        :disabled="!grid.has(cell.id)"
        :aria-label="
          grid.has(cell.id) ? `Fila ${cell.row + 1}, columna ${cell.col + 1}` : 'Casilla vacía'
        "
        @click="selectCell(cell.id)"
      >
        <span v-if="grid.has(cell.id)" class="cell-number">
          {{ cell.number }}
        </span>
        {{ letters[cell.id] ?? '' }}
      </button>
    </div>
  
  </div>
</template>

<style scoped>
.crossword-board {
  width: 100%;
  overflow: auto;
  outline: none;
}

.crossword-grid {
  display: grid;
  width: max-content;
  gap: 2px;
  margin: 0 auto;
  padding: 4px;
}

.crossword-cell {
  position: relative;
  width: 38px;
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 3px;
  background: white;
  color: #172033;
  font:
    600 16px/1 system-ui,
    sans-serif;
  text-align: center;
  cursor: pointer;
}

.crossword-cell.is-blocked {
  visibility: hidden;
  pointer-events: none;
}

.crossword-cell.is-active {
  background: #dbeafe;
}

.crossword-cell.is-selected {
  background: #93c5fd;
  border: 2px solid #2563eb;
}

.cell-number {
  position: absolute;
  top: 2px;
  left: 3px;
  font-size: 9px;
  line-height: 1;
  font-weight: 400;
}

@media (max-width: 480px) {
  .crossword-grid {
    gap: 1px;
  }

  .crossword-cell {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }
}

.crossword-cell.is-correct {
  background: #dcfce7;
  border-color: #22c55e;
  color: #166534;
}

.crossword-cell.is-incorrect {
  background: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}

.crossword-cell.is-selected.is-correct,
.crossword-cell.is-selected.is-incorrect {
  outline: 2px solid #1d4ed8;
  outline-offset: -3px;
}
</style>
