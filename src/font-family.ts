import type { Rule } from 'css';
import { Style } from './types';

export function isFontFamilyRule(rule: Rule): boolean {
  if (rule.selectors?.[0]?.startsWith(`.font-`) !== true) {
    return false;
  }

  const firstDecl = rule.declarations?.[0];
  if (!firstDecl || firstDecl.type !== `declaration`) {
    return false;
  }

  // @ts-ignore
  return firstDecl.property === `font-family`;
}

export function fontFamilyStyle(declarationValue: unknown): Style | null {
  if (typeof declarationValue !== `string`) {
    return null;
  }

  const families: string = declarationValue;
  let family: string;
  if (families[0] === `"`) {
    family = families.replace(/^"/, ``).replace(/",.*/, ``);
  } else {
    family = families.split(`,`).map((s) => s.trim())[0] ?? ``;
  }

  return family ? { fontFamily: family } : null;
}
