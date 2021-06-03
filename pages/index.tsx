import { AttachmentIcon } from "@chakra-ui/icons"
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { GetStaticPropsContext } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

export default function IndexPage() {
  const { t } = useTranslation("common")

  return (
    <>
      <Menu>
        <MenuButton variant="outline">Изменить язык</MenuButton>
        <MenuList>
          <MenuItem>English</MenuItem>
          <MenuItem>Русский</MenuItem>
        </MenuList>
      </Menu>
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
