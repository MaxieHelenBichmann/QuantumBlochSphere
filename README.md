# Quantum Bloch Sphere [PRELIMINARY VERSION]

An interactive 3D Bloch Sphere visualization component for React/Next.js applications. Perfect for quantum computing education and visualization.

## Contributors

- Maxie Helen Bichmann
- Gabriel Ribeiro Fernandes

## Features

- Interactive 3D Bloch sphere with orbit controls
- Smooth animated state transitions (SLERP interpolation)
- Support for both spherical coordinates and complex amplitudes
- Optional trajectory visualization for state history
- Customizable styling (colors, labels, axes)
- TypeScript support with full type definitions
- Next.js App Router compatible (`'use client'` directive)

## Run for Development

```bash
npm install
npm run storybook
```

## Installation

```bash
npm install quantum-bloch-sphere three
```

**Peer Dependencies:** This package requires `react`, `react-dom`, and `three` as peer dependencies.

## Basic Usage

```tsx
import { BlochSphere } from 'quantum-bloch-sphere';

function App() {
  return (
    <BlochSphere
      state={{ type: 'spherical', coords: { theta: Math.PI / 4, phi: 0 } }}
      width={500}
      height={500}
    />
  );
}
```

## State Input Formats

### Spherical Coordinates

```tsx
<BlochSphere
  state={{
    type: 'spherical',
    coords: {
      theta: Math.PI / 4, // Polar angle [0, PI] from +Z
      phi: Math.PI / 2,   // Azimuthal angle [0, 2*PI] from +X
    },
  }}
/>
```

### Complex Amplitudes

```tsx
// |+> state using amplitudes
<BlochSphere
  state={{
    type: 'amplitudes',
    amplitudes: {
      alpha: { real: 1 / Math.sqrt(2), imag: 0 },
      beta: { real: 1 / Math.sqrt(2), imag: 0 },
    },
  }}
/>
```

## Animation

Enable smooth animated transitions between states:

```tsx
<BlochSphere
  state={currentState}
  animation={{
    enabled: true,
    duration: 500,       // milliseconds
    easing: 'easeInOut', // 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  }}
  onAnimationStart={() => console.log('Animation started')}
  onAnimationEnd={() => console.log('Animation ended')}
/>
```

## Trajectory Visualization

Track and display the history of state changes:

```tsx
function QuantumSimulator() {
  const [state, setState] = useState({ type: 'spherical', coords: { theta: 0, phi: 0 } });
  const [history, setHistory] = useState([]);

  const handleStateChange = (spherical, cartesian) => {
    setHistory(prev => [...prev.slice(-99), spherical]);
  };

  return (
    <BlochSphere
      state={state}
      trajectory={{
        enabled: true,
        color: '#ff6b6b',
        lineWidth: 2,
        maxPoints: 100,
      }}
      history={history}
      onStateChange={handleStateChange}
    />
  );
}
```

## Styling

Customize the appearance:

```tsx
<BlochSphere
  state={state}
  style={{
    sphereColor: '#4a90d9',
    sphereOpacity: 0.3,
    stateVectorColor: '#ff4444',
    xAxisColor: '#ff0000',
    yAxisColor: '#00ff00',
    zAxisColor: '#0000ff',
    showLabels: true,
    showEquator: true,
    showMeridians: false,
    backgroundColor: 'transparent',
  }}
/>
```

## Camera Controls

Configure camera and interaction:

```tsx
<BlochSphere
  state={state}
  camera={{
    position: [2.5, 2.5, 2.5],
    fov: 50,
    enableOrbitControls: true,
    enableZoom: true,
    enablePan: false,
    autoRotateSpeed: 0, // Set > 0 for auto-rotation
  }}
/>
```

## Common Quantum States

The library exports common quantum states for convenience:

```tsx
import { commonStates } from 'quantum-bloch-sphere';

// Available states:
commonStates.zero   // |0> - North pole
commonStates.one    // |1> - South pole
commonStates.plus   // |+> - Positive X
commonStates.minus  // |-> - Negative X
commonStates.plusI  // |+i> - Positive Y
commonStates.minusI // |-i> - Negative Y
```

## Utility Functions

For advanced usage, utility functions are exported:

```tsx
import {
  amplitudesToSpherical,
  sphericalToAmplitudes,
  sphericalToCartesian,
  cartesianToSpherical,
  slerp,
} from 'quantum-bloch-sphere';
```

## Next.js Usage

The component is compatible with Next.js App Router. It includes the `'use client'` directive, so it works automatically in server components:

```tsx
// app/page.tsx
import { BlochSphere } from 'quantum-bloch-sphere';

export default function Page() {
  return <BlochSphere state={{ type: 'spherical', coords: { theta: 0, phi: 0 } }} />;
}
```

## Development

```bash
# Install dependencies
npm install

# Run Storybook for development
npm run storybook

# Build the library
npm run build

# Run tests
npm test

# Type check
npm run typecheck
```

## API Reference

### BlochSphereProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `QuantumState` | required | Current quantum state |
| `width` | `number \| string` | `400` | Canvas width |
| `height` | `number \| string` | `400` | Canvas height |
| `animation` | `AnimationConfig` | `{}` | Animation settings |
| `trajectory` | `TrajectoryConfig` | `{}` | Trajectory display settings |
| `style` | `BlochSphereStyle` | `{}` | Visual customization |
| `camera` | `CameraConfig` | `{}` | Camera and controls |
| `onStateChange` | `function` | - | Called when state changes |
| `onAnimationStart` | `function` | - | Called when animation starts |
| `onAnimationEnd` | `function` | - | Called when animation ends |
| `history` | `SphericalCoordinates[]` | `[]` | State history for trajectory |
| `className` | `string` | - | CSS class for container |

## License

MIT
