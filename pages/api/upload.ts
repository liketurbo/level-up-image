import { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"
import path from "path"

import FPE from "../../utils/FPE"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(
      "https://constructor-api.vsemayki.ru/image/upload",
      {
        method: "POST",
        body: req,
        headers: {
          "content-type": req.headers["content-type"] as string,
        },
      }
    )

    const cipher = new FPE()

    const json = await response.json()

    if (!json.url) throw new Error(JSON.stringify(json))

    const [, filename, extension] = path
      .basename(json.url)
      .match(/(.*)\.(.*)$/) as RegExpMatchArray

    return res.json({
      id: `${filename}-${cipher.encrypt(extension)}`,
    })
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
