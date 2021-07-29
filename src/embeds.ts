import Test from './components/Test/Test.svelte';

interface Configuration {
  canvasSize: {
    width: number;
  };
}

type PresentationState = 'presented' | string;

interface Message {
  name: 'update' | 'presentable';
  height: number;
}

interface ConfigurationChangeEventDetail {}

interface PresentationStateChangeEventDetail {
  newPresentationState: PresentationState;
}

declare global {
  interface GlobalEventHandlersEventMap {
    ANConfigurationChanged: CustomEvent;
    ANPresentationStateChanged: CustomEvent;
  }

  interface Window {
    applenews?: {
      presentationState: PresentationState;
      configuration: Configuration;
    };
    webkit?: {
      messageHandlers: {
        applenews: {
          postMessage: (message: Message) => void;
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

function postMessage(message: Message) {
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
  const messageType = presentationState && presentationState === 'presented' ? 'update' : 'presentable';

  const message: Message = {
    name: messageType,
    height
  };

  postMessage(message);
}

function setCanvasWidth(canvas: HTMLElement, configuration: Configuration | null) {
  if (!configuration) {
    return;
  }

  canvas.style.width = `${configuration.canvasSize.width}px`;
}

function handleConfigurationChange(_event: CustomEvent<ConfigurationChangeEventDetail>) {
  render();
}

function handlePresentationStateChange(event: CustomEvent<PresentationStateChangeEventDetail>) {
  if (event.detail.newPresentationState !== 'presented') {
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
