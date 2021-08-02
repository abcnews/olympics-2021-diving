// Global & Events

declare global {
  interface GlobalEventHandlersEventMap {
    ANConfigurationChanged: ANConfigurationChangeEvent;
    ANPresentationStateChanged: ANPresentationStateChangeEvent;
  }

  interface Window {
    applenews?: {
      configuration: ANConfiguration;
      presentationState: ANPresentationState;
    };
    webkit?: {
      messageHandlers: {
        applenews: {
          postMessage: (message: ANMessage) => void;
        };
      };
    };
  }
}

// Configuration

export interface ANConfiguration {
  canvasSize: {
    width: number;
    height: number;
  };
  contentFrame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dataSources: {
    [key: string]: string;
  };
  dynamicType: string;
  locale: string;
}

export type ANConfigurationChangeEvent = CustomEvent<ANConfigurationChangeEventDetail>;

export interface ANConfigurationChangeEventDetail {
  newConfiguration: ANConfiguration;
  oldConfiguration: ANConfiguration;
}

// Presentation State

export enum ANPresentationState {
  UNKNOWN = 'unknown',
  PRESENTED = 'presented',
  NOT_PRESENTED = 'notpresented'
}

export type ANPresentationStateChangeEvent = CustomEvent<ANPresentationStateChangeEventDetail>;

export interface ANPresentationStateChangeEventDetail {
  newPresentationState: ANPresentationState;
}

// Message

export type ANMessage =
  | {
      name: ANMessageName.PRESENTABLE;
      height: number;
      interaction?: ANInteraction;
    }
  | {
      name: ANMessageName.UPDATE;
      height: number;
      interaction?: ANInteraction;
    }
  | {
      name: ANMessageName.FAILED;
      errorCode: number;
      error: string;
    }
  | {
      name: ANMessageName.LOADING;
    };

export enum ANMessageName {
  PRESENTABLE = 'presentable',
  UPDATE = 'update',
  FAILED = 'failed',
  LOADING = 'loading'
}

export type ANInteraction =
  | {
      type: ANInteractionType.NON_INTERACTABLE;
    }
  | {
      type: ANInteractionType.INTERACTABLE;
    }
  | {
      type: ANInteractionType.SELECTABLE;
      URL: string;
    };

export enum ANInteractionType {
  NON_INTERACTABLE = 'non-interactable',
  INTERACTABLE = 'interactable',
  SELECTABLE = 'selectable'
}

// Helper Functions

export function postMessage(message: ANMessage) {
  if (window.webkit) {
    window.webkit.messageHandlers.applenews.postMessage(message);
  }
}

export function renderWithinAppleNews(
  canvas: HTMLElement,
  render: (canvas: HTMLElement) => void,
  interaction?: ANInteraction
) {
  const [configuration, presentationState] = window.applenews
    ? [window.applenews.configuration, window.applenews.presentationState]
    : [null, null];

  if (configuration) {
    canvas.style.width = `${configuration.canvasSize.width}px`;
  }

  try {
    render(canvas);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to render. Reason unknown.';

    return postMessage({
      name: ANMessageName.FAILED,
      errorCode: 1,
      error: errorMessage
    });
  }

  postMessage({
    name: presentationState === ANPresentationState.PRESENTED ? ANMessageName.UPDATE : ANMessageName.PRESENTABLE,
    height: canvas.offsetHeight,
    interaction: interaction || {
      type: ANInteractionType.INTERACTABLE
    }
  });
}

export function initAppleNews(canvas: HTMLElement, render: (canvas: HTMLElement) => void, interaction?: ANInteraction) {
  document.addEventListener('ANConfigurationChanged', _event => renderWithinAppleNews(canvas, render, interaction));
  document.addEventListener('ANPresentationStateChanged', event => {
    if (event.detail.newPresentationState !== ANPresentationState.PRESENTED) {
      renderWithinAppleNews(canvas, render, interaction);
    }
  });
}
