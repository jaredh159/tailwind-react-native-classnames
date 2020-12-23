export function preProcessTwStyle(
  property: string,
  value: string,
): [property: string, value: string] {
  if (property === `--tw-shadow` && value !== `0 0 #0000`) {
    const shadows = value.split(`),`);
    const first = (shadows.shift() || value).replace(/(\d)$/, `$1)`);
    const withoutSpread = first.replace(/ -?\d+(px)? rgba\(/, ` rgba(`);
    return [property, withoutSpread];
  } else if (property === `box-shadow`) {
    return [property, `var(--tw-shadow)`];
  }
  return [property, value];
}
