function compose(middlewares) {
  return function(ctx, next) {
    let index = -1;
    dispatch(0);
    function dispatch(i) {
      index = i;
      let fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(ctx, function next() {
        return dispatch(i + 1);
      }));
    }
  };
}

let f = compose([async function(ctx, next) {
  ctx.a = 'a';
  console.log('第一个， next之前');
  await next();
  console.log('第一个， next之后');
}, async function(ctx, next) {
  ctx.b = 'b';
  console.log('第二个， next之前');
  await next();
  console.log('第二个， next之后');
}, async function(ctx, next) {
  ctx.c = 'c';
  console.log('第三个， next之前');
  await next();
  console.log('第三个， next之后');
}]);

f({}, async (ctx, next) => {
  console.log(ctx);
  await next();
  console.log(123);
});
