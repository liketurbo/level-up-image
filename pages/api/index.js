import FormData from "form-data"
import fetch from "node-fetch"
import { v4 as uuidv4 } from "uuid"
import WebSocket from "ws"

export default async (req, res) => {
  if (!res.socket.server.ws) {
    const webSocketServer = new WebSocket.Server({ server: res.socket.server })

    webSocketServer.on("connection", (socket) => {
      const file = {
        contentType: null,
        filename: null,
        data: null,
      }

      socket.on("message", async (data) => {
        if (typeof data === "string") {
          const obj = JSON.parse(data)

          file.contentType = obj.contentType
          file.filename = obj.name
        } else {
          file.data = data
        }

        if (
          file.contentType !== null &&
          file.filename !== null &&
          file.data !== null
        ) {
          file.filename = file.filename.replace(/.*(?=\..*)/, uuidv4())

          const formData = new FormData()

          const { data: fileData, ...rest } = file

          formData.append("file", fileData, rest)

          let url = null

          try {
            const response = await fetch(
              "https://constructor-api.vsemayki.ru/image/upload",
              {
                method: "POST",
                body: formData,
              }
            )

            const json = await response.json()

            if (!json.url) {
              socket.send(
                JSON.stringify({
                  error: true,
                })
              )

              socket.terminate()

              return
            }

            url = json.url
          } catch (err) {
            console.error(err)

            socket.send(
              JSON.stringify({
                error: true,
              })
            )

            socket.terminate()

            return
          }

          socket.send(
            JSON.stringify({
              loading: 1 / 3,
            })
          )

          socket.send(
            JSON.stringify({
              urL: url,
            })
          )

          socket.terminate()
        }
      })
    })

    res.socket.server.ws = webSocketServer
  }

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
