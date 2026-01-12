import React, { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BlochSphere } from './BlochSphere';
import type { QuantumState, SphericalCoordinates } from './types';
import { commonStates } from './utils/quantum-math';

const meta: Meta<typeof BlochSphere> = {
  title: 'Components/BlochSphere',
  component: BlochSphere,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: { type: 'number', min: 200, max: 800 } },
    height: { control: { type: 'number', min: 200, max: 800 } },
  },
};

export default meta;
type Story = StoryObj<typeof BlochSphere>;

// Basic story with |0> state
export const Default: Story = {
  args: {
    state: { type: 'spherical', coords: commonStates.zero },
    width: 500,
    height: 500,
  },
};

// |1> state (south pole)
export const OneState: Story = {
  args: {
    state: { type: 'spherical', coords: commonStates.one },
    width: 500,
    height: 500,
  },
};

// |+> state (positive X axis)
export const PlusState: Story = {
  args: {
    state: { type: 'spherical', coords: commonStates.plus },
    width: 500,
    height: 500,
  },
};

// Using complex amplitudes
export const WithAmplitudes: Story = {
  args: {
    state: {
      type: 'amplitudes',
      amplitudes: {
        alpha: { real: 1 / Math.sqrt(2), imag: 0 },
        beta: { real: 1 / Math.sqrt(2), imag: 0 },
      },
    },
    width: 500,
    height: 500,
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    state: { type: 'spherical', coords: { theta: Math.PI / 3, phi: Math.PI / 4 } },
    width: 500,
    height: 500,
    style: {
      sphereColor: '#6b5b95',
      sphereOpacity: 0.4,
      stateVectorColor: '#feb236',
      xAxisColor: '#d64161',
      yAxisColor: '#ff7b25',
      zAxisColor: '#87ceeb',
      showEquator: true,
      showMeridians: true,
    },
  },
};

// With auto-rotation
export const AutoRotating: Story = {
  args: {
    state: { type: 'spherical', coords: commonStates.plus },
    width: 500,
    height: 500,
    camera: {
      autoRotateSpeed: 2,
    },
  },
};

// Interactive demo with animation
function InteractiveDemo() {
  const states: { name: string; coords: SphericalCoordinates }[] = [
    { name: '|0⟩', coords: commonStates.zero },
    { name: '|1⟩', coords: commonStates.one },
    { name: '|+⟩', coords: commonStates.plus },
    { name: '|-⟩', coords: commonStates.minus },
    { name: '|+i⟩', coords: commonStates.plusI },
    { name: '|-i⟩', coords: commonStates.minusI },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<SphericalCoordinates[]>([
    commonStates.zero,
  ]);

  const handleStateChange = useCallback(
    (state: SphericalCoordinates) => {
      setHistory((prev) => [...prev.slice(-99), state]);
    },
    []
  );

  const currentState: QuantumState = {
    type: 'spherical',
    coords: states[currentIndex].coords,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <BlochSphere
        state={currentState}
        width={500}
        height={500}
        animation={{ enabled: true, duration: 800, easing: 'easeInOut' }}
        trajectory={{ enabled: true, color: '#ff6b6b', lineWidth: 2 }}
        history={history}
        onStateChange={handleStateChange}
      />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {states.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setCurrentIndex(i)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: i === currentIndex ? '#4a90d9' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => setHistory([])}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Clear Trajectory
      </button>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// Minimal - no labels, simple styling
export const Minimal: Story = {
  args: {
    state: { type: 'spherical', coords: { theta: Math.PI / 4, phi: 0 } },
    width: 400,
    height: 400,
    style: {
      showLabels: false,
      showEquator: false,
      sphereOpacity: 0.2,
    },
    camera: {
      enableZoom: false,
      enablePan: false,
    },
  },
};
