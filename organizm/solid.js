
export class Solid {
    constructor(options = { url: "http://localhost:3000" }) {
this.init()
    }

    async init(){
        this.client = await this.client(this.options)
    }

    client(options ) {
        return new SolidClient(options)
    }
  
    async put(triple) {
console.log(this.client)
    }



}