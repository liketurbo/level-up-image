import { ChevronDownIcon } from "@chakra-ui/icons"
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react"
import { useTranslation } from "next-i18next"

export default function ChangeThemeMenu() {
  const { t } = useTranslation("common")
  const { colorMode, setColorMode } = useColorMode()

  return (
    <Menu autoSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {t("theme")}:{" "}
        {colorMode === "dark" ? t("dark-theme") : t("light-theme")}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setColorMode("light")}>
          {t("light-theme")}
        </MenuItem>
        <MenuItem onClick={() => setColorMode("dark")}>
          {t("dark-theme")}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
