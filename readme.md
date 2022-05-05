# Tailwind React Native Classnames 🏄‍♂️

> A simple, expressive API for TailwindCSS + React Native, written in TypeScript

```jsx
import { View, Text } from 'react-native';
import tw from 'twrnc';

const MyComponent = () => (
  <View style={tw`p-4 android:pt-2 bg-white dark:bg-black`}>
    <Text style={tw`text-md text-black dark:text-white`}>Hello World</Text>
  </View>
);
```

## Features 🚀

- full support for all _native_ RN styles with tailwind counterparts:
  ([view](https://reactnative.dev/docs/view-style-props),
  [layout](https://reactnative.dev/docs/layout-props),
  [image](https://reactnative.dev/docs/image-style-props),
  [shadow](https://reactnative.dev/docs/shadow-props), and
  [text](https://reactnative.dev/docs/text-style-props)).
- compatible with Tailwind CSS v3 and v2
- respects your `tailwind.config.js` for full configuration
- platform prefixes: `android:mt-4 ios:mt-2`
- dark mode support: `bg-white dark:bg-black`
- media query support: `w-48 lg:w-64` (also, arbitrary: `min-w-[600px]:flex-wrap`)
- device orientation prefixes: `portrait:flex-col landscape:flex-row`
- `vw` and `vh` unit support: `h-screen`, `min-w-screen`, `w-[25vw]`, etc...
- `retina` device pixel density prefix: `w-4 retina:w-2`
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
- [Enabling Device-Context Prefixes](#enabling-device-context-prefixes)
- [Taking Control of Dark Mode](#taking-control-of-dark-mode)
- [Customizing Breakpoints](#customizing-breakpoints)
- [Adding Custom Classes](#adding-custom-classes)
- [Matching Conditional Prefixes](#matchinb-conditional-prefixes)
- [Box-Shadows](#box-shadows)
- [RN-Only Additions](#rn-only-additions)
- [JIT-style Arbitrary Values](#jit-style-arbitrary-values)
- [Migrating from V2](#migrating-from-v2)
- [Migrating from V1](#migrating-from-v1)
- [Prior Art](#prior-art)

## Installation

```bash
npm install twrnc
```

## API

The default export is an ES6 _Tagged template function_ which is nice and terse for the
most common use case -- passing a bunch of space-separated Tailwind classes and getting
back a react-native style object:

```js
import tw from 'twrnc';

tw`pt-6 bg-blue-100`;
// -> { paddingTop: 24, backgroundColor: 'rgba(219, 234, 254, 1)' }
```

In the spirit of Tailwindcss's intuitive responsive prefix syntax, `twrnc` adds support
for **platform prefixes** to conditionally apply styles based on the current platform:

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

Dark mode support (see [here](#enabling-device-context-prefixes) for configuration);

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
import tw from 'twrnc';

const MyComponent = () => (
  <View style={tw`bg-blue-100`}>
    <Text style={tw.style('text-md', invalid && 'text-red-500')}>Hello</Text>
  </View>
);
```

...or if the tagged template function isn't your cup of tea, just import `tw.style` as
`tw`:

```jsx
import { style as tw } from 'twrnc';

const MyComponent = () => (
  <View style={tw('bg-blue-100', invalid && 'text-red-500')}></View>
);
```

## Customization

You can use `twrnc` right out of the box if you haven't customized your
`tailwind.config.js` file at all. But more likely you've got some important app-specific
tailwind customizations you'd like to use. For that reason, we expose the ability to
create a **custom configured version** of the `tw` function object.

```js
// lib/tailwind.js
import { create } from 'twrnc';

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

## Enabling Device-Context Prefixes

To enable prefixes that require runtime device data, like _dark mode_, and _screen size
breakpoints_, etc., you need to connect the `tw` function with a dynamic source of device
context information. The library exports a React hook called `useDeviceContext` that takes
care of this for you. It should be included **one time**, at the _root of your component
hierarchy,_ as shown below:

```js
import tw from './lib/tailwind'; // or, if no custom config: `from 'twrnc'`
import { useDeviceContext } from 'twrnc';

export default function App() {
  useDeviceContext(tw); // <- 👋
  return (
    <View style={tw`bg-white dark:bg-black`}>
      <Text style={tw`text-black dark:text-white`}>Hello</Text>
    </View>
  );
}
```

## Taking Control of Dark Mode

By default, if you use `useDeviceContext()` as outlined above, your app will respond to
ambient changes in the _device's color scheme_ (set in system preferences). If you'd
prefer to **explicitly control** the color scheme of your app with some in-app mechanism,
you'll need to configure things slightly differently:

```js
import { useDeviceContext, useAppColorScheme } from 'twrnc';

export default function App() {
  // 1️⃣  opt OUT of listening to DEVICE color scheme events
  useDeviceContext(tw, { withDeviceColorScheme: false });

  // 2️⃣  use the `useAppColorScheme` hook to get a reference to the current color
  // scheme, with some functions to modify it (triggering re-renders) when you need to
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw);

  return (
    {/* 3️⃣ use one of the setter functions, like `toggleColorScheme` in your app */}
    <TouchableOpacity onPress={toggleColorScheme}>
      <Text style={tw`text-black dark:text-white`}>Switch Color Scheme</Text>
    </TouchableOpacity>
  );
}
```

`useAppColorScheme()` accepts an optional second argument of an _initial value for the
color scheme._ If not supplied, it will be initialized to the current system setting at
the time the function is called.

## Customizing Breakpoints

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

## Adding Custom Classes

To add custom utilities, use the
[plugin method](https://tailwindcss.com/docs/adding-new-utilities#using-a-plugin)
described in the tailwind docs, instead of writing to a `.css` file. `twrnc` provides a
`plugin()` function you can use, but it's also compatible with the stock `tailwindcss`
function:

```js
// tailwind.config.js
const { plugin } = require('twrnc');

// or, you can use tailwinds plugin function:
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        btn: {
          padding: 3,
          borderRadius: 10,
          textTransform: `uppercase`,
          backgroundColor: `#333`,
        },
        'resize-repeat': {
          resizeMode: `repeat`,
        },
      });
    }),
  ],
};
```

Wil also allow you to supply a **string** of other utility classes (similar to `@apply`),
instead of using **CSS-in-JS** style objects:

```js
module.exports = {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        // 😎 similar to `@apply`
        btn: `px-4 py-1 rounded-full bg-red-800 text-white`,
        'body-text': `font-serif leading-relaxed tracking-wide text-gray-800`,
      });
    }),
  ],
};
```

## Matching Conditional Prefixes

`twrnc` also exposes a `tw.prefixMatch(...prefixes: string[]) => boolean` function that
allows you to test whether a given prefix (or combination of prefixes) would produce a
style given the current device context. This can be useful when you need to pass some
primitive value to a component, and wish you could leverage `tw`'s knowledge of the
current device, or really anywhere you just need to do some logic based on the device
context. This could also be accomplished by importing `Platform` or a combination of other
RN hooks, but chances are you've already imported your `tw` function, and this saves you
re-implementing all that logic on your own:

```tsx
const SomeComponent = () => (
  <View>
    <Thumbnail imageSize={tw.prefixMatch(`portrait`) ? 60 : 90} />;
    {tw.prefixMatch(`ios`, `dark`) ? <CustomIosDarkModeThing /> : <Thing />}
  </View>
);
```

## Box Shadows

Box shadows [in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#syntax)
differ substantially from [shadow in RN](https://reactnative.dev/docs/shadow-props), so
this library doesn't attempt to parse CSS box-shadow strings and translate them into RN
style objects. Instead, it offers a number of low-level utilities not present in
`tailwindcss`, which map to the
[4 shadow props](https://reactnative.dev/docs/shadow-props) in RN:

```js
// RN `shadowColor`
tw`shadow-white`; // > { shadowColor: `#fff` }
tw`shadow-red-200`; // > { shadowColor: `#fff` }
tw`shadow-[#eaeaea]`; // > { shadowColor: `#eaeaea` }
tw`shadow-black shadow-color-opacity-50`; // > { shadowColor: `rgba(0,0,0,0.5)` }

// RN `shadowOffset`
tw`shadow-offset-1`; // > { shadowOffset: { width: 4, height: 4 } }
tw`shadow-offset-2/3`; // > { shadowOffset: { width: 8, height: 12 } }
tw`shadow-offset-[3px]`; // > { shadowOffset: { width: 3, height: 3 } }],
tw`shadow-offset-[4px]/[5px]`; // > { shadowOffset: { width: 4, height: 5 } }],

// RN `shadowOpacity`
tw`shadow-opacity-50`; // { shadowOpacity: 0.5 }

// RN `shadowRadius`
tw`shadow-radius-1`; // { shadowRadius: 4 }
tw`shadow-radius-[10px]`; // { shadowRadius: 10 }
```

We also provide a _default implementation_ of the `shadow-<X>` utils
[provided by tailwindcss](https://tailwindcss.com/docs/box-shadow), so you can use:

```js
tw`shadow-md`;
/*
-> {
  shadowOffset: { width: 1, height: 1 },
  shadowColor: `#000`,
  shadowRadius: 3,
  shadowOpacity: 0.125,
  elevation: 3,
}
*/
```

To override the default implementations of these named shadow classes,
[add your own custom utilties](#adding-custom-classes) -- any custom utilities you provide
with the same names will override the ones this library ships with.

## RN-Only Additions

`twrnc` implements all of the tailwind utilities which overlap with supported RN (native,
not web) style props. But it also adds a sprinkling of RN-only utilities which don't map
to web-css, including:

- [low-level shadow utilities](#box-shadows)
- [elevation](https://reactnative.dev/docs/view-style-props#elevation-android) (android
  only), eg: `elevation-1`, `elevation-4`
- `small-caps` -> `{fontVariant: 'small-caps'}`
- number based font-weight utilities `font-100`, `font-400`, (100...900)
- `direction-(inherit|ltr|rtl)`
- `align-self: baseline;` via `self-baseline`
- `include-font-padding` and `remove-font-padding` (android only: `includeFontPadding`)
- image tint color control (`tint-{color}` e.g. `tint-red-200`)

## JIT-Style Arbitrary Values

Many of the arbitrary-style utilities made possible by Tailwind JIT are implemented in
`twrnc`, including:

- arbitrary colors: `bg-[#f0f]`, `text-[rgb(33,45,55)]`
- negative values: `-mt-4`, `-tracking-[2px]`
- shorthand color opacity: `text-red-200/75` (`red-200` at `75%` opacity)
- merging color/opacity: `border-black border-opacity-75`
- arbitrary opacity amounts: `opacity-73`
- custom spacing: `mt-[4px]`, `-pb-[3px]`, `tracking-[2px]`
- arbitrary fractional insets: `bottom-7/9`, `left-5/8`
- arbitrary min/max width/height: `min-w-[40%]`, `max-h-3/8`, `w-[25vw]`, `h-[21px]`
- arbitrary breakpoints: `min-w-[600px]:flex-row`, `max-h-[1200px]:p-4`

Not every utility currently supports all variations of arbitrary values, so if you come
across one you feel is missing, open an issue or a PR.

## Migrating from V2

**Color renames**. In line with the
[upgrade guide](https://tailwindcss.com/docs/upgrade-guide#removed-color-aliases),
tailwind v3 has mapped `green`, `yellow`, and `purple` to their extended colors.
Additionally,
[gray colors](https://tailwindcss.com/docs/upgrade-guide#renamed-gray-scales) were renamed
in the extended colors to be more specific. Both of these can be resolved by following
tailwind's upgrade guide and optionally re-aliasing the colors in your
`tailwind.config.js`.

Other than checking on any changes caused by color renames in tailwindcss, there are no
breaking changes in V3 of this library, no further changes should be necessary.

New v3 prefixes and classes are being added as we identify use cases. If you do have a
feature that would help your development, please
[open an issue](https://github.com/jaredh159/tailwind-react-native-classnames/issues/new)
and include any libraries / hooks that could help someone in the community put a PR
together.

## Migrating from V1

**1.** During the rewrite, the package name on npm was changed to `twrnc`. To remove the
old library and install v2, run:

```
npm uninstall tailwind-react-native-classnames
npm install twrnc
```

**2.** Grep through your project replacing `from 'tailwind-react-native-classnames'` with
`from 'twrnc'`.

**3.** If you were using a `tailwind.config.js` you can `git rm` your `tw-rn-styles.json`
file, and switch to passing your config directly to `create` as shown below: (details
[here](#customization))

```js
const tw = create(require(`../../tailwind.config.js`));
```

That's it! 🎉 The core API and functionality should work exactly the same from v1 to v2.

## Prior Art

- The first version of this package (before it was re-written from scratch) was based
  heavily on the excellent
  [vadimdemedes/tailwind-rn](https://github.com/vadimdemedes/tailwind-rn).
- The flexible `tw.style()` api was taken outright from
  [classnames](https://github.com/JedWatson/classnames#readme)
- [TailwindCSS](https://tailwindcss.com)
- [Tailwind JIT](https://tailwindcss.com/docs/just-in-time-mode)
- [React Native](https://reactnative.dev)
