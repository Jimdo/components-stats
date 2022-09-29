import { InputParameters } from 'package-adoption';

export interface LocalConfig extends InputParameters {
  components?: { [Key: string]: boolean };
}

export interface ScannerConfig {
  includeSubComponents: boolean;
  importedFrom: string;
  processors: any[];
  components?: { [Key: string]: boolean };
}
