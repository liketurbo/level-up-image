import { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"

import FPE from "../../utils/FPE"
import getRandomInt from "../../utils/genRandomInt"
import wait from "../../utils/wait"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (typeof req.body.imageId !== "string")
      throw new Error("Invalid argument (1)")

    const [, id, encodedExtension] = req.body.imageId.match(/(.*)-(.*)/) || []

    if (typeof id !== "string" || typeof encodedExtension !== "string")
      throw new Error("Invalid argument (2)")

    const cipher = new FPE()

    const extension = cipher.decrypt(encodedExtension)

    const url = `${process.env.IMAGE_URL_PREFIX}/${id}.${extension}`

    let response = await fetch(
      "https://constructor-api.vsemayki.ru/image/resize",

      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-shop-id": "17086",
        },
        body: JSON.stringify({ url }),
      }
    )

    let json = await response.json()

    if (!json.id) throw new Error(JSON.stringify(json))

    while (true) {
      response = await fetch(
        `https://constructor-api.vsemayki.ru/image/status/${json.id}`
      )

      json = await response.json()

      if (json.status === "DONE") {
        const { width, height } = json.data.meta.image

        const imageUrl = json.data.url.replace(
          /(.*)(\..*)/,
          `$1_${width}x${height}$2`
        )

        const image = await fetch(imageUrl).then((r) => r.buffer())

        return res.send(image)
      }

      if (json.status === "PROCESSING") await wait(getRandomInt(500, 1000))
      else throw new Error(JSON.stringify(json))
    }
  } catch (error) {
    console.error(error)

    return res.json({ error: true })
  }
}
