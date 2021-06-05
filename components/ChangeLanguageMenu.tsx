import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

import GlobeIcon from "./GlobeIcon"

export default function ChangeLanguageMenu() {
  const { t } = useTranslation("common")

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={Button}
        leftIcon={<GlobeIcon />}
        rightIcon={<ChevronDownIcon />}
      >
        {t("current-language")}
      </MenuButton>
      <MenuList>
        <Link href="/" locale="en" passHref>
          <MenuItem>English</MenuItem>
        </Link>
        <Link href="/" locale="ru" passHref>
          <MenuItem>Русский</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  )
}
