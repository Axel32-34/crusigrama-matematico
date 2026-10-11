import type {
  CrosswordCell,
  CrosswordEntry,
  CrosswordGrid,
  CrosswordWord,
  Direction,
} from '../types/crossword'

export const words: CrosswordWord[] = [
  {
    word: 'TRANSFORMACIONES',
    clue: 'Modificaciones geométricas (desplazamientos, alargamientos o compresiones) que se aplican a la gráfica de una función.',
  },
  {
    word: 'EXPONENCIALES',
    clue: 'Funciones trascendentes en las cuales la variable independiente figura como exponente.',
  },
  {
    word: 'PARES',
    clue: 'Funciones que son simétricas respecto al eje y, cumpliendo que al evaluar con un valor negativo se obtiene el mismo resultado positivo.',
  },
  {
    word: 'POLINOMIALES',
    clue: 'Tipo de funciones algebraicas formadas por la suma de términos con potencias enteras no negativas.',
  },
  {
    word: 'INYECTIVA',
    clue: 'Función en la cual cada elemento del recorrido corresponde a un único elemento del dominio (relación uno a uno).',
  },
  {
    word: 'COMPOSICION',
    clue: 'Operación entre funciones que consiste en aplicar una función al resultado de otra.',
  },
  {
    word: 'MODELIZACION',
    clue: 'Proceso de representar fenómenos de la vida real (físicos, químicos, económicos, etc.) mediante el uso de funciones.',
  },
  {
    word: 'DOMINIO',
    clue: 'Conjunto de todos los valores de entrada posibles (variable independiente) para los cuales una función está definida.',
  },
  {
    word: 'IMPLICITA',
    clue: 'Tipo de función en la que la variable dependiente no está despejada explícitamente en términos de la variable independiente.',
  },
  {
    word: 'PARTES',
    clue: 'Funciones cuya regla de correspondencia cambia dependiendo del intervalo o subdominio en el que se encuentre la variable.',
  },
  {
    word: 'GRAFICA',
    clue: 'Representación visual en el plano cartesiano del conjunto de pares ordenados que conforman una función.',
  },
  {
    word: 'INTERVALOS',
    clue: 'Subconjuntos de números reales comprendidos entre dos valores, los cuales se pueden representar gráficamente en la recta numérica.',
  },
  {
    word: 'INVERSA',
    clue: 'Función que revierte o deshace el efecto de la función original, intercambiando su dominio y su rango.',
  },
  {
    word: 'MODELOS',
    clue: 'Estructuras matemáticas basadas en funciones que se formulan para analizar y describir situaciones en diferentes contextos.',
  },
  {
    word: 'REALES',
    clue: 'Conjunto numérico básico que incluye a los números racionales e irracionales, fundamental en el estudio de las funciones.',
  },
]
/*
export const words: CrosswordWord[] = [
  {
    word: 'COMPOSICION',
    clue: 'Operación que aplica una función al resultado de otra.',
  },
  {
    word: 'POLINOMIO',
    clue: 'Expresión algebraica formada por una suma de términos.',
  },
  {
    word: 'EXPONENCIAL',
    clue: 'Función en la que la variable aparece en el exponente.',
  },
  {
    word: 'TRAMOS',
    clue: 'Intervalos usados en una función definida por partes.',
  },
  {
    word: 'MODELO',
    clue: 'Estructura matemática que describe una situación real.',
  },
  {
    word: 'PARES',
    clue: 'Funciones simétricas respecto al eje vertical.',
  },
  {
    word: 'IMPLICITA',
    clue: 'Función o relación en la que la variable dependiente no está despejada.',
  },
  {
    word: 'INYECTIVA',
    clue: 'Función en la que entradas diferentes tienen salidas diferentes.',
  },
  {
    word: 'FUNCION',
    clue: 'Relación que asigna una salida a cada entrada de su dominio.',
  },
  {
    word: 'DOMINIO',
    clue: 'Conjunto de valores permitidos para la variable independiente.',
  },
  {
    word: 'RANGO',
    clue: 'Conjunto de valores que puede tomar la variable dependiente.',
  },
  {
    word: 'CUADRATICA',
    clue: 'Función polinómica de segundo grado.',
  },
]

const key = (row: number, col: number) => `${row},${col}`

function canPlace(
  grid: CrosswordGrid,
  word: string,
  row: number,
  col: number,
  direction: Direction,
): boolean {
  const dr = direction === 'down' ? 1 : 0
  const dc = direction === 'across' ? 1 : 0

  const before = key(row - dr, col - dc)
  const after = key(row + dr * word.length, col + dc * word.length)

  if (grid.has(before) || grid.has(after)) return false

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i
    const c = col + dc * i
    const cell = grid.get(key(r, c))
    const letter = word[i]

    if (cell && cell.letter !== letter) return false

    if (!cell) {
      const neighbors =
        direction === 'across' ? [key(r - 1, c), key(r + 1, c)] : [key(r, c - 1), key(r, c + 1)]

      if (neighbors.some((neighbor) => grid.has(neighbor))) {
        return false
      }
    }
  }

  return true
}

function addWord(grid: CrosswordGrid, entry: CrosswordEntry): void {
  const dr = entry.direction === 'down' ? 1 : 0
  const dc = entry.direction === 'across' ? 1 : 0

  for (let i = 0; i < entry.word.length; i++) {
    const row = entry.row + dr * i
    const col = entry.col + dc * i
    const id = key(row, col)

    grid.set(id, {
      row,
      col,
      letter: entry.word[i],
    })
  }
}

function findPlacement(
  grid: CrosswordGrid,
  word: string,
  entries: CrosswordEntry[],
): Omit<CrosswordEntry, 'number' | 'clue'> | null {
  // Buscar una letra coincidente con una palabra ya colocada.
  for (const entry of entries) {
    const dr = entry.direction === 'down' ? 1 : 0
    const dc = entry.direction === 'across' ? 1 : 0
    const perpendicular = entry.direction === 'across' ? 'down' : 'across'

    for (let i = 0; i < entry.word.length; i++) {
      const letter = entry.word[i]

      for (let j = 0; j < word.length; j++) {
        if (word[j] !== letter) continue

        const row = entry.row + dr * i - (perpendicular === 'down' ? j : 0)

        const col = entry.col + dc * i - (perpendicular === 'across' ? j : 0)

        if (canPlace(grid, word, row, col, perpendicular)) {
          return {
            word,
            row,
            col,
            direction: perpendicular,
          }
        }
      }
    }
  }

  return null
}

export function buildCrossword() {
  const grid: CrosswordGrid = new Map()
  const placed: CrosswordEntry[] = []

  // La primera palabra establece el punto de partida.
  const first = words[0]

  const initial: CrosswordEntry = {
    ...first,
    row: 10,
    col: 5,
    direction: 'across',
    number: 0,
  }

  addWord(grid, initial)
  placed.push(initial)

  for (const item of words.slice(1)) {
    const placement = findPlacement(grid, item.word, placed)

    if (!placement) continue

    const entry: CrosswordEntry = {
      ...item,
      ...placement,
      number: 0,
    }

    addWord(grid, entry)
    placed.push(entry)
  }

  // Ordenar y numerar los inicios de las palabras.
  const starts = new Map<string, number>()
  let nextNumber = 1

  const sorted = [...placed].sort((a, b) => a.row - b.row || a.col - b.col)

  for (const entry of sorted) {
    const id = key(entry.row, entry.col)

    if (!starts.has(id)) {
      starts.set(id, nextNumber++)
    }

    entry.number = starts.get(id)!
  }

  for (const [id, cell] of grid) {
    cell.number = starts.get(id)
  }

  // Recortar el espacio vacío y trasladar las posiciones.
  const cells = [...grid.values()]
  const minRow = Math.min(...cells.map((cell) => cell.row))
  const minCol = Math.min(...cells.map((cell) => cell.col))

  const normalizedGrid: CrosswordGrid = new Map()

  for (const cell of cells) {
    const row = cell.row - minRow
    const col = cell.col - minCol

    normalizedGrid.set(key(row, col), {
      ...cell,
      row,
      col,
    })
  }

  const normalizedEntries = placed.map((entry) => ({
    ...entry,
    row: entry.row - minRow,
    col: entry.col - minCol,
  }))

  const maxRow = Math.max(...[...normalizedGrid.values()].map((cell) => cell.row))
  const maxCol = Math.max(...[...normalizedGrid.values()].map((cell) => cell.col))

  return {
    grid: normalizedGrid,
    entries: normalizedEntries,
    rows: maxRow + 1,
    cols: maxCol + 1,
  }
}

export const cellKey = key
*/

const key = (row: number, col: number) => `${row},${col}`

function canPlace(
  grid: CrosswordGrid,
  word: string,
  row: number,
  col: number,
  direction: Direction,
): boolean {
  const dr = direction === 'down' ? 1 : 0
  const dc = direction === 'across' ? 1 : 0

  const before = key(row - dr, col - dc)
  const after = key(row + dr * word.length, col + dc * word.length)

  if (grid.has(before) || grid.has(after)) return false

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i
    const c = col + dc * i
    const cell = grid.get(key(r, c))
    const letter = word[i]

    if (cell && cell.letter !== letter) return false

    if (!cell) {
      const neighbors =
        direction === 'across' ? [key(r - 1, c), key(r + 1, c)] : [key(r, c - 1), key(r, c + 1)]

      if (neighbors.some((neighbor) => grid.has(neighbor))) {
        return false
      }
    }
  }

  return true
}

function addWord(grid: CrosswordGrid, entry: CrosswordEntry): void {
  const dr = entry.direction === 'down' ? 1 : 0
  const dc = entry.direction === 'across' ? 1 : 0

  for (let i = 0; i < entry.word.length; i++) {
    const row = entry.row + dr * i
    const col = entry.col + dc * i
    const id = key(row, col)

    grid.set(id, {
      row,
      col,
      letter: entry.word[i],
    })
  }
}

function findPlacement(
  grid: CrosswordGrid,
  word: string,
  entries: CrosswordEntry[],
): Omit<CrosswordEntry, 'number' | 'clue'> | null {
  // Buscar una letra coincidente con una palabra ya colocada.
  for (const entry of entries) {
    const dr = entry.direction === 'down' ? 1 : 0
    const dc = entry.direction === 'across' ? 1 : 0
    const perpendicular = entry.direction === 'across' ? 'down' : 'across'

    for (let i = 0; i < entry.word.length; i++) {
      const letter = entry.word[i]

      for (let j = 0; j < word.length; j++) {
        if (word[j] !== letter) continue

        const row = entry.row + dr * i - (perpendicular === 'down' ? j : 0)
        const col = entry.col + dc * i - (perpendicular === 'across' ? j : 0)

        if (canPlace(grid, word, row, col, perpendicular)) {
          return {
            word,
            row,
            col,
            direction: perpendicular,
          }
        }
      }
    }
  }

  return null
}

export function buildCrossword() {
  const grid: CrosswordGrid = new Map()
  const placed: CrosswordEntry[] = []

  // La primera palabra establece el punto de partida.
  const first = words[0]

  const initial: CrosswordEntry = {
    ...first,
    row: 10,
    col: 5,
    direction: 'across',
    number: 0,
  }

  addWord(grid, initial)
  placed.push(initial)

  for (const item of words.slice(1)) {
    const placement = findPlacement(grid, item.word, placed)

    if (!placement) continue

    const entry: CrosswordEntry = {
      ...item,
      ...placement,
      number: 0,
    }

    addWord(grid, entry)
    placed.push(entry)
  }

  // Ordenar y numerar los inicios de las palabras.
  const starts = new Map<string, number>()
  let nextNumber = 1

  const sorted = [...placed].sort((a, b) => a.row - b.row || a.col - b.col)

  for (const entry of sorted) {
    const id = key(entry.row, entry.col)

    if (!starts.has(id)) {
      starts.set(id, nextNumber++)
    }

    entry.number = starts.get(id)!
  }

  for (const [id, cell] of grid) {
    cell.number = starts.get(id)
  }

  // Recortar el espacio vacío y trasladar las posiciones.
  const cells = [...grid.values()]
  const minRow = Math.min(...cells.map((cell) => cell.row))
  const minCol = Math.min(...cells.map((cell) => cell.col))

  const normalizedGrid: CrosswordGrid = new Map()

  for (const cell of cells) {
    const row = cell.row - minRow
    const col = cell.col - minCol

    normalizedGrid.set(key(row, col), {
      ...cell,
      row,
      col,
    })
  }

  const normalizedEntries = placed.map((entry) => ({
    ...entry,
    row: entry.row - minRow,
    col: entry.col - minCol,
  }))

  const maxRow = Math.max(...[...normalizedGrid.values()].map((cell) => cell.row))
  const maxCol = Math.max(...[...normalizedGrid.values()].map((cell) => cell.col))

  return {
    grid: normalizedGrid,
    entries: normalizedEntries,
    rows: maxRow + 1,
    cols: maxCol + 1,
  }
}

export const cellKey = key
