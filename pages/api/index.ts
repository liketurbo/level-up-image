import { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"

import wait from "../../utils/wait"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let response = await fetch(
      "https://constructor-api.vsemayki.ru/image/upload",
      {
        method: "POST",
        body: req,
        headers: {
          "content-type": req.headers["content-type"] as string,
        },
      }
    )

    let json = await response.json()

    if (!json.url) throw new Error(JSON.stringify(json))

    response = await fetch(
      "https://constructor-api.vsemayki.ru/image/resize",

      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-shop-id": "17086",
        },
        body: JSON.stringify({ url: json.url }),
      }
    )

    json = await response.json()

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

      if (json.status === "PROCESSING") await wait(1000)
      else throw new Error(JSON.stringify(json))
    }
  } catch (error) {
    console.error(error)

    return res.json({ error: true })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
