import { childIdView, clsidView,
  creationTimeView, directoryEntryNameLengthView, directoryEntryNameView, flagColorView,
  leftSiblingIdView, modificationTimeView,
  objectTypeView, rightSiblingIdView, startingSectorLocationView, stateBitsView,
  streamSizeView } from './dataViews'

/**
 *
 */
export class DirectoryEntry {
  constructor(private buffer: ArrayBuffer) {}

  public check(): boolean {
    const chars = Array.from(directoryEntryNameView(this.buffer).values())
    const indexOfZero = chars.indexOf(0)
    const nameLength = this.nameLength()

    return ((directoryEntryNameLengthView(this.buffer)[0] % 2 === 0) &&
      ((indexOfZero === 0 && nameLength === -1) || indexOfZero === nameLength))
  }

  public getName(): string {
    const chars = Array.from(directoryEntryNameView(this.buffer).values())
      .slice(0, this.nameLength())

    return String.fromCodePoint(...chars)
  }

  public nameLength(): number {
    return directoryEntryNameLengthView(this.buffer)[0] / 2 - 1
  }

  public getStartingSectorLocation(): number {
    return startingSectorLocationView(this.buffer)[0]
  }

  public getStreamSize(): number {
    // read 64-bit integer as two 32-bit integers
    const sizeArray = streamSizeView(this.buffer)

    // least-significant-4-bytes + most-significant-4-bytes * Math.pow(2, 32)
    return sizeArray[0] + sizeArray[1] * 0x100000000
  }

  public getLeftId(): number {
    return leftSiblingIdView(this.buffer)[0]
  }

  public getRightId(): number {
    return rightSiblingIdView(this.buffer)[0]
  }

  public getChildId(): number {
    return childIdView(this.buffer)[0]
  }

  public getObjectType(): number {
    return objectTypeView(this.buffer)[0]
  }
}
