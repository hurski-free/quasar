export const PARTICLES_BUFFER_CAPACITY = 5_000_000; // 5m particles
export const PARTICLES_GPU_VALUES_PER_ELEMENT = 7; // polarR, polarAngle, z, diameter, colorR, colorG, colorB
export const PARTICLES_CPU_VALUES_PER_ELEMENT = 2;
export const PARTICLES_FLAGS_VALUES_PER_ELEMENT = 1;

export const PARTICLES_BUFFER_CPU_ID = 'particlesCPU';
export const PARTICLES_BUFFER_GPU_ID = 'particlesGPU';
export const PARTICLES_BUFFER_FLAGS_ID = 'particlesFlags';

export const JETS_BUFFER_CAPACITY = 150_000; // 150k particles for jets
export const JETS_GPU_VALUES_PER_ELEMENT = 7; // polarR, polarAngle, z, diameter, colorR, colorG, colorB
export const JETS_CPU_VALUES_PER_ELEMENT = 3; // [lifetime, moveAngle, moveZ]

export const JETS_BUFFER_CPU_ID = 'jetsCPU';
export const JETS_BUFFER_GPU_ID = 'jetsGPU';
