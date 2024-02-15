# Migrating to 4.x.x

## 🚨 Breaking Changes

### Breakpoint Boundaries

Prior to `v4.0.0` `twrnc` displayed subtly different behavior for media query ranges from
TailwindCSS. Specifically, TailwindCSS media queries are **inclusive** of the _minimum_,
and older versions of `twrnc` were **exclusive** of the range minimum. In practical terms
that means that a utility like `md:bg-black` is applicable in TailwindCSS _when the screen
size is **exactly** `768px` wide,_ whereas in `twrnc@3.x.x` that class would only begin to
apply at **`769px`.** Version `4.0.0` corrects this off-by-one error, making the library
more consistent with TailwindCSS.

We think that this will not affect most library consumers, but it is possible that you
could see a difference in appearance if your device window size is precisely the same as a
media query range minimum, so this is technically a breaking change.

If you'd like to restore the prior behavior, you can customize your theme's `screens`,
settings:

```js
module.exports = {
  theme: {
    screens: {
      sm: '641px',
      md: '769px',
      lg: '1025px',
      xl: '1281px',
    },
  },
};
```

### `useAppColorScheme()` Initialization

_NB: If you were not using dark mode, or were only observing the device's color scheme
(which is the default and most common), you can ignore this section._

The mechanism for opting-out of listening to device color scheme changes in order to
_control color scheme manually_ from your app has changed in `v4.0.0`. First,
`useAppColorScheme()` no longer takes a second parameter for initialization:

```diff
-const [colorScheme, ...] = useAppColorScheme(tw, `light`);
+const [colorScheme, ...] = useAppColorScheme(tw);
```

This means that `useAppColorScheme()` is now safe to use multiple times in your app,
anywhere you need to read or modify the app color scheme. As part of this change the
**initialization has moved** to `useDeviceContext()` (which should only ever be called
once, at the root of the app):

```diff
useDeviceContext(tw, {
-  withDeviceColorScheme: false,
+  observeDeviceColorSchemeChanges: false,
+  initialColorScheme: "light",
});
```

The value for `initialColorScheme` can be `"light"`, `"dark"`, or `"device"`. `device`
means initialize to the _current_ color scheme of the device one time before the app
assumes control.

_Please note:_ there was a bug in `v3.x.x` when omitting the optional initialization param
(now removed) passed to `useAppColorScheme()` that caused the color scheme to not be
correctly initialized when the device was in **dark mode**. Version `4.x.x` fixes this
issue, but the bugfix can result in an observable difference in your app's initialization
for users whose devices are set to dark mode. If you want to replicate the former behavior
before the bug was fixed, you should explicitly pass `"light"` for `initialColorScheme`
when calling `useDeviceContext()`.

## 💃 New Features

The main `tw` object now exposes a `.memoBuster` string property, which can be useful for
resolving some simple memoization re-render failure issues. See
[here for more](./readme.md#memo-busting).

# Migrating to 3.x.x

**Color renames**. In line with the
[upgrade guide](https://tailwindcss.com/docs/upgrade-guide#removed-color-aliases),
tailwind v3 has mapped `green`, `yellow`, and `purple` to their extended colors.
Additionally,
[gray colors](https://tailwindcss.com/docs/upgrade-guide#renamed-gray-scales) were renamed
in the extended colors to be more specific. Both of these can be resolved by following
tailwind's upgrade guide and optionally re-aliasing the colors in your
`tailwind.config.js`.

Other than checking on any changes caused by color renames in tailwindcss, there are no
breaking changes in v3 of this library, no further changes should be necessary.

New v3 prefixes and classes are being added as we identify use cases. If you do have a
feature that would help your development, please
[open an issue](https://github.com/jaredh159/tailwind-react-native-classnames/issues/new)
and include any libraries / hooks that could help someone in the community put a PR
together.

# Migrating to 2.x.x

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
