class Person {
  constructor(name) {  
    this.name = name;
  }
  async  sayHello(args) {
    return "Hello "+args.name; 
  }
  
  async  sayGoodye(args) {
    return "Goodbye "+args.name;
  }
}