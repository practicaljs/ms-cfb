/**
 * Determines whether two sequences are equal
 * @param fst first sequence
 * @param snd second sequence
 */
export function arraysAreEqual<T>(fst: T[], snd: T[]) : boolean {
  if (fst === snd) {
    return true
  }
  if (fst.length !== snd.length) {
    return false
  }

  return fst.every((value: T, index: number) => value === snd[index])
}

/**
 *
 * @param arrays
 */
export function concat<T>(arrays: T[][]): T[] {
  return Array.prototype.concat(...arrays)
}

export function range(start: number, stop: number): number[] {
  return Array.from(Array(stop - start).keys()).map((value: number) => value + start)
}
