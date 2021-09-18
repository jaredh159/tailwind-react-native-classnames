# TODOs

## Pre v2.0.0 Release

- [√] `bg-[#fea123]`
- [√] check all TODO comments
- [√] unify helper functions/usage
- [√] remove error type
- [√] consider removing result type
- [√] figure out warn strategy
- [√] make `toStyleVal` not throw
- [√] sort out npm naming things...
- [√] look into opacity cache bug
- [ ] flex-1, https://tailwindcss.com/docs/flex utils
- [ ] multi-utility caching
- [ ] restore v1 shadox-X utilities (overridable)
- [ ] register custom utilities
- [ ] v2 documentation

## Post v2.0.0 Release

- [ ] double-dashed configged colors
- [ ] add font-scale prefix
- [ ] add dpi/retina "scale" prefix
- [ ] use window dimensions to support some `vw` and `vh` style utilities
- [ ] explore writing a babel plugin to erase statically resolvable function calls

```json
{
  "flex-1": {
    "flexGrow": 1,
    "flexShrink": 1,
    "flexBasis": "0%"
  },
  "flex-auto": {
    "flexGrow": 1,
    "flexShrink": 1,
    "flexBasis": "auto"
  },
  "flex-initial": {
    "flexGrow": 0,
    "flexShrink": 1,
    "flexBasis": "auto"
  },
  "flex-none": {
    "flexGrow": 0,
    "flexShrink": 0,
    "flexBasis": "auto"
  }
}
```
