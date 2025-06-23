import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  cleanup()
})

// Mock window.location for React Router
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: () => {},
    replace: () => {},
    reload: () => {},
    toString: () => 'http://localhost:3000/'
  },
  writable: true
})

// Mock ResizeObserver for chart.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cb: any
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(cb: any) {
    this.cb = cb
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this)
  }
  unobserve() {}
  disconnect() {}
}

// Mock HTMLCanvasElement.getContext for Chart.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(HTMLCanvasElement.prototype.getContext as any) = () => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (_x: number, _y: number, w: number, h: number) => {
      return {
        data: new Array(w * h * 4)
      }
    },
    putImageData: () => {},
    createImageData: () => new Array(0),
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => {
      return { width: 0 }
    },
    transform: () => {},
    rect: () => {},
    clip: () => {},
  }
}
