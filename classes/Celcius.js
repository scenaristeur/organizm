class Celcius {
  constructor(nimp) {  // Constructor
    this.nimp = nimp;
  }
  async  convertToCelsius(args) {
    return args.degrees + 1; 
  }
  
  async  convertToBumblebees(args) {
    return args.degrees + 2;
  }
}