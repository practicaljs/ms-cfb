import { range } from './arrays'

export type UintSize = 8 | 16 | 32 | 64

/**
 * Generic getter/setter for unsigned integer values on a `DataView` object
 */
export class UintDataView {
  constructor(private dataview: DataView, private size: UintSize, private byteOffset: number) {
    if (size !== 8 && size !== 16 && size !== 32 && size !== 64) {
      throw new Error('Not a valid byteSize for an integer')
    }
  }

  public getValue(littleEndianness: boolean): number {
    const { dataview, byteOffset } = this
    switch (this.size) {
      case 8:
        return dataview.getUint8(byteOffset)
      case 16:
        return dataview.getUint16(byteOffset, littleEndianness)
      case 32:
        return dataview.getUint32(byteOffset, littleEndianness)
      default: // 64
        const [v1, v2] = [dataview.getUint32(byteOffset + (littleEndianness ? 0 : 4), littleEndianness),
        dataview.getUint32(byteOffset + (littleEndianness ? 4 : 0), littleEndianness)]

        return v1 * 0x100000000 + v2
    }
  }

  public setValue(value: number, littleEndianness: boolean): void {
    const { dataview, byteOffset } = this
    switch (this.size) {
      case 8:
        dataview.setUint8(byteOffset, value)
        break
      case 16:
        dataview.setUint16(byteOffset, value, littleEndianness)
        break
      case 32:
        dataview.setUint32(byteOffset, value, littleEndianness)
        break
      default: // 64
        // tslint:disable-next-line:no-bitwise
        const v1 = value >>> 0
        const v2 = value - v1
        dataview.setUint32(byteOffset + (littleEndianness ? 0 : 4), v1, littleEndianness)
        dataview.setUint32(byteOffset + (littleEndianness ? 4 : 0), v2, littleEndianness)
        break
    }
  }
}

/**
 * Generic getter/setter for an array of unsigned integer values on a `DataView` object
 */
export class UintArrayDataView {
  constructor(dataview: DataView, size: UintSize) {
    const byteSize = size / 8
    this.dataviews = range(0, dataview.byteLength / byteSize)
      // tslint:disable-next-line:no-non-null-assertion
      .map((index: number) => new UintDataView(dataview, size, index * byteSize))
  }

  public getValue(littleEndianness: boolean): number[] {
    return this.dataviews.map((dataview: UintDataView) => dataview.getValue(littleEndianness))
  }

  public setValue(values: number[], littleEndianness: boolean): void {
    this.dataviews.forEach((dataview: UintDataView, index: number) => {
      dataview.setValue(values[index], littleEndianness)
    })
  }

  private dataviews: UintDataView[]
}
