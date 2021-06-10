import { Box, Flex, Heading, Spacer } from "@chakra-ui/react"
import { useTranslation } from "next-i18next"

import ChangeLanguageMenu from "./ChangeLanguageMenu"
import ChangeThemeMenu from "./ChangeThemeMenu"

export default function Header() {
  const { t } = useTranslation("common")

  return (
    <Flex alignItems="center" py={2}>
      <Heading size="md">{t("title")}</Heading>
      <Spacer />
      <Box mr={2}>
        <ChangeThemeMenu />
      </Box>
      <ChangeLanguageMenu />
    </Flex>
  )
}
