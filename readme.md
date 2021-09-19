# Tailwind React Native Classnames 🏄‍♂️

> A simple, expressive API for TailwindCSS + React Native, written in TypeScript

```jsx
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const MyComponent = () => (
  <View style={tw`p-4 android:pt-2 bg-red-300 flex-row`}>
    <Text style={tw`text-md tracking-wide`}>Hello World</Text>
  </View>
);
```

#### 🚀 &nbsp;_V2 Now in Beta_ 🚀

_Help us beta-test the new V2 re-write, including dark-mode, breakpoints, JIT-mode, and
more. Docs and migration guide
[over here](https://github.com/jaredh159/tailwind-react-native-classnames/tree/v2#readme)._

---

## API

The default export is an ES6 _Tagged template function_ which is nice and terse for the
most common use case -- passing a bunch of space-separated Tailwind classes and getting
back a react-native style object:

```js
import tw from 'tailwind-react-native-classnames';

tw`pt-6 bg-blue-100`;
// -> { paddingTop: 24, backgroundColor: 'rgba(219, 234, 254, 1)' }
```

In the spirit of Tailwindcss's intuitive responsive prefix syntax,
`tailwind-react-native-classnames` adds support for **platform prefixes** to conditionally
apply styles based on the current platform:

```js
// 😎 styles only added if platform matches
tw`ios:pt-4 android:pt-2`;
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
tw.style('bg-blue-100', { elevation: 3, lineHeight: 13.5 });

// mix and match input styles as much as you want
tw.style('bg-blue-100', ['flex-row'], { 'text-xs': true }, { fontSize: 9 });
```

The `tw` function also has a method `color` that can be used to get back a string value of
a tailwind color. Especially useful if you're using a customized color pallette.

```js
tw.color('blue-100');
// -> "rgba(219, 234, 254, 1)"
```

You can import the main `tw` function and reach for `tw.style` only when you need it:

```jsx
import tw from 'tailwind-react-native-classnames';

const MyComponent = () => (
  <View style={tw`bg-blue-100`}>
    <Text style={tw.style('text-md', invalid && 'text-red-500')}>Hello</Text>
  </View>
);
```

...or if the tagged template function isn't your jam, just import `tw.style` as `tw`:

```jsx
import { style as tw } from 'tailwind-react-native-classnames';

const MyComponent = () => (
  <View style={tw('bg-blue-100', invalid && 'text-red-500')}></View>
);
```

## Installation

```bash
npm install tailwind-react-native-classnames
```

## Customization

You can use `tailwind-react-native-classnames` right out of the box if you haven't
customized your `tailwind.config.js` file at all. But more likely you've got some
important app-specific tailwind customizations you'd like to use. In that case, this
package exposes a cli command to generate a style-map which can then be used to create
your own custom-scoped `tw` function, like so:

```bash
npx trnc-create-styles
```

This command will create a `tw-rn-styles.json` file in the root of your project dir. This
file contains the info the package needs to generate customized react-native styles. It
should be checked in to source control, and regenerated whenever you change your
`tailwind.config.js` file. Then, somewhere in your app, you just do this:

```js
// lib/tailwind.js
import { create } from 'tailwind-react-native-classnames';
import styles from '../../tw-rn-styles.json'; // <-- your path may differ

// this function works just like the default package export
// except it is customized according to your `tailwind.config.js`
const tw = create(styles);

export default tw;
```

...and in your component files import your own customized version of the function instead:

```jsx
// SomeComponent.js
import tw from './lib/tailwind';
```

## Prior Art

- Though not a fork, this package was based heavily on the excellent
  [vadimdemedes/tailwind-rn](https://github.com/vadimdemedes/tailwind-rn).
- The flexible `tw.style()` api was taken outright from
  [classnames](https://github.com/JedWatson/classnames#readme)
- [TailwindCSS](https://tailwindcss.com)
- [React Native](https://reactnative.dev)
