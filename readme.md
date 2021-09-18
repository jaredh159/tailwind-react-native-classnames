# Tailwind React Native Classnames (v2) 🏄‍♂️

**🚨 WARNING 🚨** These are _version 2.0.0_ **beta** docs. For stable v1 docs,
[see here.](https://github.com/jaredh159/tailwind-react-native-classnames/tree/master#readme)

---

> A simple, expressive API for TailwindCSS + React Native, written in TypeScript

```jsx
import { View, Text } from 'react-native';
import tw from '@jaredh159/twrn';

const MyComponent = () => (
  <View style={tw`p-4 android:pt-2 bg-white dark:bg-black`}>
    <Text style={tw`text-md text-black dark:text-white`}>Hello World</Text>
  </View>
);
```

## Features 🚀

- full support for all **non-web** RN styles with tailwind counterparts:
  ([view](https://reactnative.dev/docs/view-style-props),
  [layout](https://reactnative.dev/docs/layout-props),
  [image](https://reactnative.dev/docs/image-style-props),
  [shadow](https://reactnative.dev/docs/shadow-props), and
  [text](https://reactnative.dev/docs/text-style-props)).
- respects your `tailwind.config.js` for full configuration
- platform prefixes: `android:mt-4 ios:mt-2`
- dark mode support: `bg-white dark:bg-black`
- media query suport: `w-48 lg:w-64`
- arbitrary, JIT-style classes: `mt-[31px] bg-[#eaeaea] text-red-200/75`, etc...
- tagged template literal synax for most common usage
- merges supplied RN style objects for unsupported utilities or complex use cases
- supports custom utility creation via standard
  [plugin config](https://tailwindcss.com/docs/adding-new-utilities#using-a-plugin).
- heavily optimized for performance - styles resolved once, then stored in in-memory cache
- flexible, conditional styles based on
  [classnames package api](https://github.com/JedWatson/classnames).
- written 100% in Typescript, ships with types

## Docs:

- [Installation](#installation)
- [API](#api)
- [Customization](#customization)
- [Enabling Dark Mode](#enabling-dark-mode)
- [Enabling Breakpoints](#enabling-breakpoints)
- [Adding Custom Classes](#adding-custom-classes) TODO
- [Box-Shadows](#box-shadows) TODO
- [RN-Only Additions](#rn-only-additions) TODO
- [JIT-style Arbitrary Values](#jit-style-arbitrary-values) TODO
- [Prior Art](#prior-art)

## Installation

```bash
npm install @jaredh159/twrn@next
```

## API

The default export is an ES6 _Tagged template function_ which is nice and terse for the
most common use case -- passing a bunch of space-separated Tailwind classes and getting
back a react-native style object:

```js
import tw from '@jaredh159/twrn';

tw`pt-6 bg-blue-100`;
// -> { paddingTop: 24, backgroundColor: 'rgba(219, 234, 254, 1)' }
```

In the spirit of Tailwindcss's intuitive responsive prefix syntax, `@jaredh159/twrn` adds
support for **platform prefixes** to conditionally apply styles based on the current
platform:

```js
// 😎 styles only added if platform matches
tw`ios:pt-4 android:pt-2`;
```

Media query-like breakpoint prefixes supported (see [Breakpoints](#breakpoints) for
configuration):

```js
// 😎 faux media queries
tw`flex-col lg:flex-row`;
```

Dark mode support (see [Dark mode](#darkmode) for configuration);

```js
// 😎 dark mode support
tw`bg-white dark:bg-black`;
```

You can also use `tw.style()` for handling more complex class name declarations. The api
for this function is directly taken from the excellent
[classnames](https://github.com/JedWatson/classnames#readme) package.

```js
// pass multiple args
tw.style('text-sm', 'bg-blue-100', 'flex-row mb-2');

// arrays of classnames work too
tw.style(['text-sm', 'bg-blue-100']);

// falsy stuff is ignored, so you can do conditionals like this
tw.style(isOpen && 'bg-blue-100');

// { [className]: boolean } style - key class only added if value is `true`
tw.style({
  'bg-blue-100': isActive,
  'text-red-500': invalid,
});

// or, combine tailwind classes with plain react-native style object:
tw.style('bg-blue-100', { resizeMode: `repeat` });

// mix and match input styles as much as you want
tw.style('bg-blue-100', ['flex-row'], { 'text-xs': true }, { fontSize: 9 });
```

If you need some styling that is not supported in a utility class, or just want to do some
custom run-time logic, you can **pass raw RN style objects** to `tw.style()`, and they get
merged in with the styles generated from any other utility classes:

```js
tw.style(`mt-1`, {
  resizeMode: `repeat`,
  width: `${progress}%`,
});
// -> { marginTop: 4, resizeMode: 'repeat', width: '32%' }
```

The `tw` function also has a method `color` that can be used to get back a string value of
a tailwind color. Especially useful if you're using a customized color pallette.

```js
tw.color('blue-100');
// -> "rgba(219, 234, 254, 1)"
```

You can import the main `tw` function and reach for `tw.style` only when you need it:

```jsx
import tw from '@jaredh159/twrn';

const MyComponent = () => (
  <View style={tw`bg-blue-100`}>
    <Text style={tw.style('text-md', invalid && 'text-red-500')}>Hello</Text>
  </View>
);
```

...or if the tagged template function isn't your jam, just import `tw.style` as `tw`:

```jsx
import { style as tw } from '@jaredh159/twrn';

const MyComponent = () => (
  <View style={tw('bg-blue-100', invalid && 'text-red-500')}></View>
);
```

## Customization

You can use `@jaredh159/twrn` right out of the box if you haven't customized your
`tailwind.config.js` file at all. But more likely you've got some important app-specific
tailwind customizations you'd like to use. For that reason, we expose the ability to
create a **custom configured version** of the `tw` function object.

```js
// lib/tailwind.js
import { create } from '@jaredh159/twrn';

// create the customized version...
const tw = create(require(`../../tailwind.config.js`)); // <- your path may differ

// ... and then this becomes the main function your app uses
export default tw;
```

...and in your component files import your own customized version of the function instead:

```jsx
// SomeComponent.js
import tw from './lib/tailwind';
```

## Enabling Dark Mode

To enable **dark mode** for classes like `dark:bg-black`, you need to make the `tw`
function aware of the current color scheme, and update it on any changes to the color
scheme. To do that, go to the _highest-level_ component in your app, and configure it with
`tw.setColorScheme()` as shown below:

```js
import { useColorScheme } from 'react-native'; // 1️⃣  import `useColorScheme`
import tw from './lib/tailwind'; // or, if no custom config: `from '@jaredh/twrn'`

export default function App() {
  const colorScheme = useColorScheme(); // 2️⃣  use the hook
  tw.setColorScheme(colorScheme); // 3️⃣  pass the resolved value to tw

  return (
    <View style={tw`bg-white dark:bg-black`}>
      <Text style={tw`text-black dark:text-white`}>Hello</Text>
    </View>
  );
}
```

If you have a bespoke method of enabling/disabling dark mode other than relying on the
host OS, you can call `tw.setColorScheme()` whenever you want, as long as the _type_ of
what you pass is: `'light' | 'dark' | null | undefined` -- matching the RN type returneda
from `useColorScheme()`:

```ts
const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(`light`);
  tw.setColorScheme(mode); // 👋  <-- pass your custom dark-mode state

  // [...]
};
```

## Enabling Breakpoints

To enable **faux media-query breakpoints** for classes like `md:flex-row`, you need to
make the `tw` function aware of the current window, and update it on any changes to the
same. To do that, go to the _highest-level_ component in your app, and configure it with
`tw.setWindow()` as shown below:

```js
import { useWindowDimensions } from 'react-native'; // 1️⃣  import `useWindowDimensions`
import tw from './lib/tailwind'; // or, if no custom config: `from '@jaredh/twrn'`

export default function App() {
  const rnWindow = useWindowDimensions(); // 2️⃣  use the hook
  tw.setWindow(rnWindow); // 3️⃣  pass the resolved value to tw

  return (
    <View style={tw`flex-col lg:flex-row`}>
      <Text style={tw`text-2xl`}>Hello</Text>
      <Text style={tw`text-xl`}>World</Text>
    </View>
  );
}
```

You can **customize the breakpoints** in the same way as a
[tailwindcss web project](https://tailwindcss.com/docs/breakpoints), using
`tailwind.config.js`. The defaults that ship with `tailwindcss` are geared towards the
web, so you likely want to set your own for device sizes you're interested in, like this:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: '380px',
      md: '420px',
      lg: '680px',
      // or maybe name them after devices for `tablet:flex-row`
      tablet: '1024px',
    },
  },
};
```

## Prior Art

- The first version of this package (before it was re-written from scratch) was based
  heavily on the excellent
  [vadimdemedes/tailwind-rn](https://github.com/vadimdemedes/tailwind-rn).
- The flexible `tw.style()` api was taken outright from
  [classnames](https://github.com/JedWatson/classnames#readme)
- [TailwindCSS](https://tailwindcss.com)
- [Tailwind JIT](https://tailwindcss.com/docs/just-in-time-mode)
- [React Native](https://reactnative.dev)
