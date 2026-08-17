const trimTrailingSlash = (value = '') => value.replace(/\/$/, '')

const UPDATE_ORIGIN = trimTrailingSlash(
  import.meta.env.VITE_DOWNLOAD_ORIGIN
    || 'https://arrivals-reuters-gets-reduction.trycloudflare.com',
)

const route = (path) => `${UPDATE_ORIGIN}${path}`

export const DOWNLOAD_CHANNELS = {
  windows: {
    x64: {
      url: route('/windows/FlexHub.exe'),
      manifest: route('/windows/latest.yml'),
    },
  },
  linux: {
    x64: {
      baseUrl: route('/linux/x64'),
      manifest: route('/linux/x64/latest-linux.yml'),
    },
    arm64: {
      baseUrl: route('/linux/arm64'),
      manifest: route('/linux/arm64/latest-linux-arm64.yml'),
    },
  },
}

export const DOWNLOAD_MANIFEST_ENDPOINT = import.meta.env.VITE_DOWNLOAD_MANIFEST_ENDPOINT || ''
