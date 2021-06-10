import fpe from "node-fpe"

export default class FPE {
  private domain: string[]

  constructor() {
    this.domain = []
    this.initializeDomain()

    this.cipher = fpe({ secret: process.env.SECRET, domain: this.domain })
  }

  private initializeDomain() {
    for (let i = 0; i < 26; i++) this.domain.push(String.fromCharCode(97 + i))

    for (let i = 0; i < 10; i++) this.domain.push(String.fromCharCode(48 + i))
  }

  public encrypt(str: string) {
    return this.cipher.encrypt(str)
  }

  public decrypt(str: string) {
    return this.cipher.decrypt(str)
  }
}
