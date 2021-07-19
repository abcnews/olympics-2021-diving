export type OneOrTwoValues = [number] | [number, number];

export interface RangeSliderStopEvent extends CustomEvent {
  detail: {
    activeHandle: number;
    startValue: number;
    value: number;
    values: [number];
  };
}

interface Config {
  question: string;
  score: number;
}

export const CONFIGS: { [key: string]: Config } = {
  nikita: {
    question: 'As a certified armchair critic, what would you score Nikitaʼs dive out of 10?',
    score: 7.5
  },
  melissa: {
    question: 'What would you score Melissaʼs dive?',
    score: 9.5
  },
  sam: {
    question: 'What would you score Samʼs dive?',
    score: 6.5
  }
};

export const bAttr = (value: boolean) => (value ? '' : undefined);

export const formatScore = (score: number) => (score > 0 && score < 10 ? score.toFixed(1) : String(score));

export const getEstimateScoreDiff = (estimate: number, score: number) => Math.abs(score - estimate);

export const getInitialReaction = (estimate: number, score: number) => {
  const diff = getEstimateScoreDiff(estimate, score);

  if (diff === 0) {
    return 'Bang on!';
  } else if (diff <= 1) {
    return 'Youʼre warm.';
  } else if (diff <= 3) {
    return 'Not quite.';
  }

  return 'Way off!';
};

export const getDetailedReaction = (estimate: number, score: number) =>
  `Our Olympic judge ${getEstimateScoreDiff(estimate, score) === 0 ? 'also gave this' : 'scored this dive'} a ${score}`;

const WIDONT_PATTERN = /\s([^\s<]+)\s*$/;
const WIDONT_REPLACEMENT = '\u00A0$1';

export const widont = (text: string) => text.replace(WIDONT_PATTERN, WIDONT_REPLACEMENT);
