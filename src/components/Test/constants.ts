export const PUBLIC_PATH = __webpack_public_path__;

interface Config {
  gif: string;
  question: string;
  score: number;
}

export const CONFIGS: { [key: string]: Config } = {
  nikita: {
    gif: `screen_view_still.gif`,
    question: 'As a certified armchair critic, what would you score Nikitaʼs dive out of 10?',
    score: 7.5
  },
  melissa: {
    gif: `screen_view_still.gif`,
    question: 'What would you score Melissaʼs dive?',
    score: 9.5
  },
  sam: {
    gif: `screen_view_still.gif`,
    question: 'What would you score Samʼs dive?',
    score: 6.5
  }
};

const formatScoreAsFraction = (score: number) => String(score).replace(/0?.5/, '½');

export const formatPipValue = (score: number) => score.toFixed(2);

export const formatHandleValue = (score: number) => `${score > 0 && score < 10 ? score.toFixed(1) : score} / 10`;

export const getInitialReaction = (estimate: number, score: number) => {
  const diff = Math.abs(score - estimate);

  if (diff === 0) {
    return 'Bang on!';
  } else if (diff <= 1) {
    return 'Youʼre warm';
  } else if (diff <= 3) {
    return 'Not quite';
  }

  return 'Way off!';
};

export const getDetailedReaction = (estimate: number, score: number) => {
  const diff = Math.abs(score - estimate);
  const formattedScore = formatScoreAsFraction(score);

  if (diff === 0) {
    return `Our Olympic judge also gave this dive a ${formattedScore}`;
  }

  return `You were ${diff < 1 ? 'a ' : ''}${formatScoreAsFraction(diff)} point${
    diff <= 1 ? '' : 's'
  } off our Olympic judge, who gave this dive a ${formattedScore}`;
};
