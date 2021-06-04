import { AttachmentIcon, DeleteIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react"
import { GetStaticPropsContext } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState } from "react"

// import io from "socket.io-client"
import Footer from "../components/Footer"
import Header from "../components/Header"

export default function IndexPage() {
  const { t } = useTranslation("common")

  const [image, setImage] = useState<string | null>(null)

  return (
    <Container
      maxW="container.md"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      <Header />
      <Flex
        justifyContent="center"
        as="form"
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.target as HTMLFormElement)

          fetch("/api").then(() => {
            const socket = new WebSocket("ws://localhost:1234/api")

            const file = formData.get("file") as File

            socket.addEventListener("open", async () => {
              socket.send(
                JSON.stringify({
                  contentType: file.type,
                  name: file.name,
                })
              )

              socket.send(file)
            })
          })
        }}
      >
        <Button
          leftIcon={<AttachmentIcon />}
          colorScheme="blue"
          variant="solid"
          as="label"
          cursor="pointer"
          display={image ? "none" : "flex"}
        >
          {t("upload-image")}
          <input
            type="file"
            accept="image/*"
            hidden
            name="file"
            onChange={(e) => {
              if (!e.target.files) return

              const src = URL.createObjectURL(e.target.files[0])

              setImage(src)
            }}
          />
        </Button>
        {image && (
          <IconButton
            aria-label="Delete image"
            icon={<DeleteIcon />}
            colorScheme="red"
            variant="outline"
            mx={2}
            onClick={() => {
              URL.revokeObjectURL(image)

              setImage(null)
            }}
          />
        )}
        {image && (
          <Button colorScheme="green" type="submit">
            {t("enhance-image")}
          </Button>
        )}
      </Flex>
      {image && (
        <Image
          mt={2}
          src={image}
          objectFit="contain"
          height="auto"
          minHeight={0}
          flex={1}
        />
      )}
      <Box mt="auto" mb={2}>
        <Footer />
      </Box>
    </Container>
  )
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common"])),
      // Will be passed to the page component as props
    },
  }
}
