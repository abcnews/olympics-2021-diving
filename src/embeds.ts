import Test from './components/Test/Test.svelte';

interface ANConfiguration {
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

enum ANPresentationState {
  UNKNOWN = 'unknown',
  PRESENTED = 'presented',
  NOTPRESENTED = 'notpresented'
}

interface ANMessage {
  name: 'update' | 'presentable';
  height: number;
}

interface ANConfigurationChangeEventDetail {
  newConfiguration: ANConfiguration;
  oldConfiguration: ANConfiguration;
}

interface ANPresentationStateChangeEventDetail {
  newPresentationState: ANPresentationState;
}

declare global {
  interface GlobalEventHandlersEventMap {
    ANConfigurationChanged: CustomEvent;
    ANPresentationStateChanged: CustomEvent;
  }

  interface Window {
    applenews?: {
      presentationState: ANPresentationState;
      configuration: ANConfiguration;
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

const COMPONENTS = {
  test: Test
};

function getCanvas() {
  return document.getElementById('embed') as HTMLElement;
}

function renderToCanvas(canvas: HTMLElement) {
  const { component, ...props } = canvas.dataset;
  const Component = component && COMPONENTS[component];

  if (Component) {
    if (canvas.firstElementChild) {
      return;
    }

    new Component({
      target: canvas,
      props
    });
  }
}

function postMessage(message: ANMessage) {
  if (window.webkit) {
    window.webkit.messageHandlers.applenews.postMessage(message);
  }
}

function render() {
  const presentationState = window.applenews ? window.applenews.presentationState : null;
  const configuration = window.applenews ? window.applenews.configuration : null;
  const canvas = getCanvas();
  setCanvasWidth(canvas, configuration);
  renderToCanvas(canvas);

  const height = canvas.offsetHeight;
  const messageType =
    presentationState && presentationState === ANPresentationState.PRESENTED ? 'update' : 'presentable';

  const message: ANMessage = {
    name: messageType,
    height
  };

  postMessage(message);
}

function setCanvasWidth(canvas: HTMLElement, configuration: ANConfiguration | null) {
  if (!configuration) {
    return;
  }

  canvas.style.width = `${configuration.canvasSize.width}px`;
}

function handleConfigurationChange(_event: CustomEvent<ANConfigurationChangeEventDetail>) {
  render();
}

function handlePresentationStateChange(event: CustomEvent<ANPresentationStateChangeEventDetail>) {
  if (event.detail.newPresentationState !== ANPresentationState.PRESENTED) {
    render();
  }
}

window.addEventListener('load', () => {
  if (window.applenews) {
    document.addEventListener('ANConfigurationChanged', handleConfigurationChange);
    document.addEventListener('ANPresentationStateChanged', handlePresentationStateChange);
    render();
  } else {
    renderToCanvas(getCanvas());
  }
});
