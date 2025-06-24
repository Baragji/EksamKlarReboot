/**
 * Export/Import Utility
 * Provides functions for exporting and importing data to/from files
 */

/**
 * Export data to a file
 * @param data Data to export (will be stringified)
 * @param filename Name of the file to create
 * @returns Promise that resolves when export is complete
 */
export const exportToFile = async (data: unknown, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Convert data to JSON string
      const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      
      // Create a blob with the data
      const blob = new Blob([jsonString], { type: 'application/json' })
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob)
      
      // Create a link element
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.style.display = 'none'
      
      // Add the link to the document
      document.body.appendChild(a)
      
      // Click the link to trigger the download
      a.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        resolve()
      }, 100)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Import data from a file
 * @returns Promise that resolves with the imported data
 */
export const importFromFile = async (): Promise<{ data: unknown }> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a file input element
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      
      // Handle file selection
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }
        
        // Read the file
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const data = JSON.parse(content)
            resolve({ data })
          } catch {
            reject(new Error('Invalid JSON file'))
          }
        }
        reader.onerror = () => {
          reject(new Error('Error reading file'))
        }
        reader.readAsText(file)
      }
      
      // Trigger file selection
      input.click()
    } catch (error) {
      reject(error)
    }
  })
}