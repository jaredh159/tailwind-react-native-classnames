#!/usr/bin/env node
import * as fs from 'fs';
import { red, yellow, magenta, log, c, gray } from 'x-chalk';
import postcss from 'postcss';
import { parse, Rule, Declaration } from 'css';

// @ts-ignore
import cssToReactNative from 'css-to-react-native';

// @ts-ignore
import * as tailwind from 'tailwindcss';

magenta(`\nStarting generation of tailwind styles...`);

postcss([tailwind])
  .process(`@tailwind components;\n@tailwind utilities;`, { from: undefined })
  .then(({ css }) => {
    const styles = toStyleObject(css);
    const path = `${process.cwd()}/tw-rn-styles.json`;
    fs.writeFileSync(path, JSON.stringify(styles, null, 2));
    log(c`{green Success!} {gray Styles file generated at} {cyan ${path}}`);
    gray(
      `Commit this file and use it to create a customized version of the tailwind fn:\n`,
    );
    log(SAMPLE_CODE);
  })
  .catch((err) => {
    red(`Error generating tailwind styles file\n`);
    console.error(err);
  });

const SAMPLE_CODE = `
\`\`\`js
import { create } from 'tailwind-react-native-classnames';
import styles from './path/to/your/tw-rn-styles.json';

const customTailwind = create(styles);
export default customTailwind;
\`\`\`
`;

function toStyleObject(css: string): Record<string, Record<string, string | number>> {
  const { stylesheet } = parse(css);
  if (!stylesheet) {
    red(`Failed to parse CSS`);
    process.exit(1);
  }

  const styles: Record<string, Record<string, string | number>> = {};
  for (const rule of stylesheet.rules) {
    if (rule.type === `rule` && `selectors` in rule) {
      for (const selector of rule.selectors || []) {
        const utility = selector.replace(/^\./, ``).replace(`\\/`, `/`);

        if (isUtilitySupported(utility, rule)) {
          styles[utility] = getStyles(rule);
        }
      }
    }
  }

  // Additional styles that we're not able to parse correctly automatically
  styles.underline = { textDecorationLine: `underline` };
  styles[`line-through`] = { textDecorationLine: `line-through` };
  styles[`no-underline`] = { textDecorationLine: `none` };

  return styles;
}

function getStyles(rule: Rule): Record<string, string | number> {
  const declarations = (rule.declarations || []) as Declaration[];
  const styles = declarations
    .filter(({ property, value = `` }) => {
      if (property === `line-height` && !value.endsWith(`rem`)) {
        return false;
      }
      return true;
    })
    .map(({ property, value = `` }) => {
      if (value.endsWith(`rem`)) {
        return [property, remToPx(value)];
      }

      return [property, value];
    });

  return cssToReactNative(styles);
}

function isUtilitySupported(utility: string, rule: Rule): boolean {
  // Skip utilities with pseudo-selectors
  if (utility.includes(`:`)) {
    return false;
  }

  // Skip unsupported utilities
  if (
    [
      `clearfix`,
      `antialiased`,
      `subpixel-antialiased`,
      `sr-only`,
      `not-sr-only`,
    ].includes(utility) ||
    /^(space|placeholder|from|via|to|divide)-/.test(utility) ||
    /^-?(scale|rotate|translate|skew)-/.test(utility)
  ) {
    return false;
  }

  // Skip utilities with unsupported properties
  for (const { property, value = `` } of (rule.declarations || []) as Declaration[]) {
    if (property && unsupportedProperties.has(property)) {
      return false;
    }

    if (property === `display` && ![`flex`, `none`].includes(value)) {
      return false;
    }

    if (property === `overflow` && ![`visible`, `hidden`].includes(value)) {
      return false;
    }

    if (property === `position` && ![`absolute`, `relative`].includes(value)) {
      return false;
    }

    if (property === `line-height` && !value.endsWith(`rem`)) {
      return false;
    }

    if (property === `border-color` && value === `inherit`) {
      return false;
    }

    if (
      value === `auto` ||
      value.endsWith(`vw`) ||
      value.endsWith(`vh`) ||
      value === `currentColor`
    ) {
      return false;
    }
  }

  return true;
}

const unsupportedProperties = new Set([
  `box-sizing`,
  `float`,
  `clear`,
  `object-fit`,
  `object-position`,
  `overflow-x`,
  `overflow-y`,
  `-webkit-overflow-scrolling`,
  `overscroll-behavior`,
  `overscroll-behavior-x`,
  `overscroll-behavior-y`,
  `visibility`,
  `order`,
  `grid-template-columns`,
  `grid-column`,
  `grid-column-start`,
  `grid-column-end`,
  `grid-template-rows`,
  `grid-row`,
  `grid-row-start`,
  `grid-row-end`,
  `grid-auto-flow`,
  `grid-auto-columns`,
  `grid-auto-rows`,
  `gap`,
  `column-gap`,
  `row-gap`,
  `justify-items`,
  `justify-self`,
  `place-content`,
  `place-items`,
  `place-self`,
  `font-family`,
  `list-style-type`,
  `list-style-position`,
  `text-decoration`,
  `vertical-align`,
  `white-space`,
  `word-break`,
  `background-attachment`,
  `background-clip`,
  `background-position`,
  `background-repeat`,
  `background-size`,
  `background-image`,
  `border-collapse`,
  `table-layout`,
  `box-shadow`,
  `transition-property`,
  `transition-duration`,
  `transition-timing-function`,
  `transition-delay`,
  `animation`,
  `transform`,
  `transform-origin`,
  `appearance`,
  `cursor`,
  `outline`,
  `resize`,
  `user-select`,
  `fill`,
  `stroke`,
  `stroke-width`,
]);

function remToPx(value: string): string {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    yellow(`Warning: invalid rem->px conversion from "${value}"`);
    return `0px`;
  }
  return `${parsed * 16}px`;
}
