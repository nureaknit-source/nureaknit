import * as migration_20260815_145711 from './20260815_145711';
import * as migration_20260907_083500_add_performance_indexes from './20260907_083500_add_performance_indexes';

export const migrations = [
  {
    up: migration_20260815_145711.up,
    down: migration_20260815_145711.down,
    name: '20260815_145711'
  },
  {
    up: migration_20260907_083500_add_performance_indexes.up,
    down: migration_20260907_083500_add_performance_indexes.down,
    name: '20260907_083500_add_performance_indexes'
  },
];
