/// <reference types="react" />

declare module 'react-slidedown' {
  import { ReactChild, Component } from 'react';

  type SlideDownProps = {
      transitionOnAppear?: boolean,
      closed?: boolean
  };

  interface SlideDownNode extends Component<SlideDownProps> { }

  export function SlideDown(props: SlideDownProps): SlideDownNode;
}
