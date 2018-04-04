/**
 * Created by Administrator on 2018/3/15.
 */
const Rx = require('rx');
let observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});

console.log('just before subscribe');
observable.subscribe(() => {
  return {
    next: x => console.log('got value ' + x),
    error: err => console.error('something wrong occurred: ' + err),
    complete: () => console.log('done'),
  }
});
console.log('just after subscribe');

