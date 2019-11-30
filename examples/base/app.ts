import axios from '../../src/index';

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: ['bar', 'baz', , 'xx']
//   }
// });

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: {
//       bar: 'baz'
//     }
//   }
// });

// const date = new Date();

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     date
//   }
// });

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: '@:$, '
//   }
// });

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: 'bar',
//     baz: null
//   }
// });

// axios({
//   method: 'get',
//   url: '/base/get#hash',
//   params: {
//     foo: 'bar'
//   }
// });

// axios({
//   method: 'get',
//   url: '/base/get?foo=bar',
//   params: {
//     bar: 'baz'
//   }
// });

axios({
  method: 'post',
  url: 'http://localhost:8000/base/post',
  data: {
    a: 1,
    b: 2
  }
});

const arr = new Int32Array([21, 31]);

axios({
  method: 'post',
  url: '/base/buffer',
  data: arr
});
