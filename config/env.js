function ifElse(condition) {
  return (isTrue, isFalse) => {
    return condition ? isTrue : isFalse;
  };
}

const BUILD = process.env.BUILD || 'development';

const isDev = BUILD === 'development';
const isProd = BUILD === 'production';

const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);

module.exports = {
  isDev,
  isProd,
  ifDev,
  ifProd
};
