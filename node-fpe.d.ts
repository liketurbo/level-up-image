declare module "node-fpe" {
  export default function cypher(params: {
    secret: string
    domain: string[]
  }): {
    encrypt: (str: string) => string
    decrypt: (str: string) => string
  }
}
