
module.exports = ({ router }) => {
  // getting the home route
  router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  });
  router.get('/deposit', (ctx, next) => {
    ctx.body = 'Deposit!';
  });
    router.get('/vote', (ctx, next) => {
    ctx.body = 'Vote!';
  });
};