import create from './tailwind';
export * from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwind = create(require(`../tw-rn-styles.json`));
export default tailwind;
export { create };
