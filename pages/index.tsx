import {
  AttachmentIcon,
  DeleteIcon,
  DownloadIcon,
  SettingsIcon,
} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react"
import { GetStaticPropsContext } from "next"
import Head from "next/head"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState } from "react"

import Footer from "../components/Footer"
import Header from "../components/Header"

export default function IndexPage() {
  const { t } = useTranslation("common")

  const [image, setImage] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const [processedImage, setProcessedImage] = useState<string | null>(null)

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
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
          onSubmit={async (e) => {
            e.preventDefault()

            setLoading(true)

            try {
              const formData = new FormData(e.target as HTMLFormElement)

              const res = await fetch("/api", {
                method: "POST",
                body: formData,
              })

              const arrayBuffer = await res.arrayBuffer()

              const file = formData.get("file") as File

              const blob = new Blob([arrayBuffer], { type: file.type })

              setProcessedImage(URL.createObjectURL(blob))
            } finally {
              setLoading(false)
            }
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
          {image && !loading && (
            <IconButton
              aria-label="Delete image"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              type="button"
              mx={2}
              onClick={() => {
                URL.revokeObjectURL(image)

                setProcessedImage(null)
                setImage(null)
              }}
            />
          )}
          {processedImage && (
            <Button
              colorScheme="green"
              type="button"
              rightIcon={<DownloadIcon />}
              as="a"
              href={processedImage}
              download
            >
              {t("download")}
            </Button>
          )}
          {image && !processedImage && (
            <Button
              colorScheme="green"
              type="submit"
              rightIcon={<SettingsIcon />}
              loadingText={t("loading")}
              isLoading={loading}
            >
              {t("enhance-image")}
            </Button>
          )}
        </Flex>
        {image && (
          <Image
            mt={2}
            src={processedImage || image}
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
    </>
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
