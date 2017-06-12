react-slidein
============================
React component which uses CSS to animate a child from its current height to ```height: auto``` when mounting/updating/unmounting.

[![build status](https://secure.travis-ci.org/frankwallis/react-slidein.png?branch=master)](http://travis-ci.org/frankwallis/react-slidein)

## Overview ##

CSS does not currently support animating element height to ```height: auto```. and so *normally* javascript is used to achieve this effect.

This component uses CSS to perform the animation, following an algorithm ([first described here](http://n12v.com/css-transition-to-from-auto)). The desired height of the element is calculated, and then css is used to transition that height. After the transition is complete the height is set to ```height: auto```.

## Installation ##

```sh
npm install react-slidein --save
```

## Usage ##

Simply wrap the component you want slide in the ```SlideIn``` component:

```js
import React from 'react'
import {SlideIn} from 'react-slidein'

export function MyDropdown(props) {
  return (
    <SlideIn className={'my-dropdown-slidein'}>
      {props.open ? props.children : null}
    </SlideIn>
  )
}
```

## Example ##

To run the example project:
```
git clone https://github.com/frankwallis/react-slidein.git
cd react-slidein
npm install
npm start
```

## Customisation ##

You can customise the transition used for the animation by overriding styles on the ```SlideIn``` component:

```cs
.react-slidein.my-dropdown-slidein {
    transition-duration: 1.2s;
    transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
}
```

The default values used are:

```cs
.react-slidein {
    transition-duration: .5s;
    transition-timing-function: ease-in-out;
}
```