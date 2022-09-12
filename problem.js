function* myGen(arr) {
    let i = arr.length;
    while (i-- > 0) {
        console.log(i)
      yield arr[i] * 2;
    }
  }
  
  const it = myGen([1, 2, 3]);
  
//   let next = it.next();
  console.log(it.next())
  console.log(it.next())
  console.log(it.next())
//   while (!next.done) {
//     const val = next.value;
//     next = it.next();
//     console.log('value:', val, ' is last = ', next.done);
//   }
  
//   console.log('done:', next.done)