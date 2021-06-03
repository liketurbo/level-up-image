import { AttachmentIcon } from "@chakra-ui/icons"
import { Button, Container } from "@chakra-ui/react"
import { GetStaticPropsContext } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import Header from "../components/Header"

export default function IndexPage() {
  const { t } = useTranslation("common")

  return (
    <Container maxW="container.md">
      <Header />
      <Button leftIcon={<AttachmentIcon />} colorScheme="blue" variant="solid">
        {t("upload-image")}
      </Button>
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
