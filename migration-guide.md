## Migrating from 2.x.x

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

## Migrating from 1.x.x

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
