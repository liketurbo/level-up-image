import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

export default function ChangeLanguageMenu() {
  const { t } = useTranslation("common")

  return (
    <Menu autoSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {t("language")}: {t("current-language")}
      </MenuButton>
      <MenuList>
        <Link href="/" locale="en" passHref>
          <MenuItem value="en">English</MenuItem>
        </Link>
        <Link href="/" locale="ru" passHref>
          <MenuItem value="ru">Русский</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  )
}
