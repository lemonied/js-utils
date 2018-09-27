// 隐式原型
function A() {
  this.a = 1
}
A.prototype.b = 2

var c = new A()
var c1 = Object.create(c)
console.log(c1.__proto__) // A {a: 1}     c作为c1的隐式原型
console.log(c1.__proto__.__proto__) // A {b: 1}
console.log(c1.a) // 1
console.log(c1.b) // 2
console.log(c.isPrototypeOf(c1)) // true
console.log(Object.getPrototypeOf(c1)) // {a: 1}
console.log(Object.getPrototypeOf(c1) === c) // true （c1的隐式原型就是c）
console.log(Object.keys(c1)) // []    (key不可被枚举)
console.log(c1 instanceof A) // true
// Object.create()作用是以目标对象作为隐式原型创建新的对象

// 继承
function B() {
  A.call(this)
  this.a = 2
}
B.prototype = new A()
B.prototype.constructor = B // 修正构造函数
var bB = new B()
console.log(bB instanceof B) // true
console.log(bB instanceof A) // true
