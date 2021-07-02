interface Config {
  dataURL: string;
  startVH?: number;
  endVH?: number;
  minBlockHeightVH?: number;
  backgroundColor?: string;
}

export const CONFIG_DEFAULTS = {
  startVH: 0,
  endVH: 0,
  minBlockHeightVH: 100,
  backgroundColor: '#fff'
};

export const CONFIGS: { [key: string]: Config } = {
  stages: {
    startVH: -40,
    endVH: -80,
    minBlockHeightVH: 1200,
    dataURL: `${__webpack_public_path__}scrubby/stages/data.json`
  },
  stagesblank: {
    startVH: -40,
    endVH: -80,
    minBlockHeightVH: 1200,
    dataURL: `${__webpack_public_path__}scrubby/stagesblank/data.json`
  }
};

export type LinearScale = (value: number) => number;

export const createLinearScale =
  (domain: [number, number], range: [number, number], clamp: boolean = false): LinearScale =>
  (value: number) => {
    if (domain[0] === domain[1] || range[0] === range[1]) {
      return range[0];
    }

    const ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
      result = range[0] + ratio * (value - domain[0]);

    return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
  };
