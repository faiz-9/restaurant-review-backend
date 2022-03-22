// class EventEmitter {
//   _events;
//   constructor() {
//     this._events = {};
//   }
//   on(eventName, func) {
//     if (this._events[eventName]) {
//       this._events[eventName].push({ func });
//     } else {
//       this._events[eventName] = [{ func }];
//     }
//   }
//
//   emit(eventName, data) {
//     if (this._events[eventName]) {
//       for (const { func } of this._events[eventName]) {
//         func(data);
//       }
//     }
//   }
//   remove(eventName, func) {
//     if (this._events[eventName]) {
//       this._events[eventName] = this._events[eventName].filter(
//         (item) => item.func !== func,
//       );
//     }
//   }
// }
//
// class Cat {
//   em;
//   room;
//   constructor(em, room) {
//     this.em = em;
//     this.room = room;
//     this.em.on('dog_bark', this.onDogBark);
//   }
//
//   makeVoice() {
//     console.log('cat is meaw');
//   }
//
//   onDogBark = ({ room }) => {
//     if (room === this.room) this.makeVoice();
//   };
// }
// class Dog {
//   em;
//   room;
//   constructor(em, room) {
//     this.em = em;
//     this.room = room;
//   }
//
//   makeVoice() {
//     console.log('dog is bark');
//     this.em.emit('dog_bark', { room: this.room });
//   }
// }
// e = new EventEmitter();
// c = new Cat(e, 'room2');
// d = new Dog(e, 'room2');
// c.makeVoice();
// d.makeVoice();
// const p = new Promise((res, rej) => {
//   setTimeout(() => res('Res'), 1000);
//   setTimeout(() => rej('Rej'), 3000);
// });
