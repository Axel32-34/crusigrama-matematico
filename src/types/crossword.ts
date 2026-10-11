export type Direction = 'across' | 'down'

export interface CrosswordWord {
  word: string
  clue: string
}

export interface CrosswordEntry extends CrosswordWord {
  row: number
  col: number
  direction: Direction
  number: number
}

export interface CrosswordCell {
  row: number
  col: number
  letter: string
  number?: number
}

export type CrosswordGrid = Map<string, CrosswordCell>
