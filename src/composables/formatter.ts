export function useTitleCase() {
  // Core title case formatter
  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .filter((word) => word.trim() !== '')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatSubmittedData = <T>(data: T): T => {
    if (typeof data === 'string') {
      return toTitleCase(data) as T
    }

    if (typeof data === 'object' && data !== null) {
      const result: Record<string, any> = {}
      for (const key in data) {
        const value = (data as Record<string, any>)[key]
        result[key] = typeof value === 'string' ? toTitleCase(value) : value
      }
      return result as T
    }

    return data
  }

  return {
    toTitleCase,
    formatSubmittedData,
  }
}
