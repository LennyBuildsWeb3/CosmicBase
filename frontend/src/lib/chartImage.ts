/**
 * Utility for converting SVG natal charts to PNG images
 */

export async function svgToDataURL(svgElement: SVGElement): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Serialize the SVG to string
      const svgString = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      // Create an image element
      const img = new Image()
      img.onload = () => {
        // Create a canvas to render the image
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 800
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw the image on canvas
        ctx.drawImage(img, 0, 0)

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png')
        URL.revokeObjectURL(url)
        resolve(dataURL)
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load SVG image'))
      }

      img.src = url
    } catch (error) {
      reject(error)
    }
  })
}

export async function dataURLToBlob(dataURL: string): Promise<Blob> {
  const response = await fetch(dataURL)
  return response.blob()
}

export async function svgToBlob(svgElement: SVGElement): Promise<Blob> {
  const dataURL = await svgToDataURL(svgElement)
  return dataURLToBlob(dataURL)
}
