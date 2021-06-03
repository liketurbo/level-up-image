import { AttachmentIcon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import { GetStaticPropsContext } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import ChangeLanguageMenu from "../components/ChangeLanguageMenu"

export default function IndexPage() {
  const { t } = useTranslation("common")

  return (
    <>
      <ChangeLanguageMenu />
      <Button leftIcon={<AttachmentIcon />} colorScheme="blue" variant="solid">
        {t("upload-image")}
      </Button>
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
