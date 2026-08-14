import { describe, expect, it } from 'vitest'
import { parseYaml } from './DownloadsSection'

describe('parseYaml', () => {
  it('reads version, paths and sizes from an electron-updater manifest', () => {
    const result = parseYaml(`version: 1.4.7
files:
  - url: FlexHub.1.4.7.x64.AppImage
    sha512: abc
    size: 104857600
  - url: FlexHub.1.4.7.x64.deb
    sha512: def
    size: 52428800
path: FlexHub.1.4.7.x64.AppImage`)

    expect(result.version).toBe('1.4.7')
    expect(result.entries).toEqual([
      { filename: 'FlexHub.1.4.7.x64.AppImage', size: 104857600 },
      { filename: 'FlexHub.1.4.7.x64.deb', size: 52428800 },
    ])
  })
})
