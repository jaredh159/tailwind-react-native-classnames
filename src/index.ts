import create from './tailwind';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwind = create(require(`../tw-rn-styles.json`));
export default tailwind;
export { create };
