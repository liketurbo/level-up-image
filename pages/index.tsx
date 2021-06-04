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
      <Flex justifyContent="center">
        {!image && (
          <Button
            leftIcon={<AttachmentIcon />}
            colorScheme="blue"
            variant="solid"
            as="label"
            cursor="pointer"
          >
            {t("upload-image")}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (!e.target.files) return

                const src = URL.createObjectURL(e.target.files[0])

                setImage(src)
              }}
            />
          </Button>
        )}
        {image && (
          <>
            <Button
              leftIcon={<AttachmentIcon />}
              colorScheme="blue"
              variant="solid"
              as="label"
              cursor="pointer"
            >
              {t("change-image")}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (!e.target.files) return

                  URL.revokeObjectURL(image)

                  const src = URL.createObjectURL(e.target.files[0])

                  setImage(src)
                }}
              />
            </Button>
            <IconButton
              aria-label="Delete image"
              icon={<DeleteIcon />}
              color="red"
              variant="outline"
              ml={2}
              onClick={() => {
                URL.revokeObjectURL(image)

                setImage(null)
              }}
            />
          </>
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
