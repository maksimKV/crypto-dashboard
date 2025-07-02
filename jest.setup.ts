import '@testing-library/jest-dom'
import 'whatwg-fetch'

// More complete mock for Chart.js in test environment
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function (type: string) {
    if (type === '2d') {
      return {
        canvas: this,
        // Methods
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: [] }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        resetTransform: () => {},
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
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {},
        // Properties
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowColor: 'black',
        strokeStyle: '#000',
        fillStyle: '#000',
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic',
      };
    }
    return null;
  }
});

// Mock ResizeObserver for Chart.js in test environment
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}