declare module 'react-scanner' {
  import { ScannerConfig } from './types';
  const scanner: {
    run: (config: ScannerConfig) => void;
  };
  export default scanner;
}
