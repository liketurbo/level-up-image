import { Flex, Link, Text } from "@chakra-ui/react"
import { useTranslation } from "next-i18next"

export default function Footer() {
  const { t } = useTranslation("common")

  return (
    <Flex justifyContent="center">
      <Text mr={1}>{t("powered-by")}</Text>
      <Link href="https://letsenhance.io" color="blue">
        Letsenhance
      </Link>
    </Flex>
  )
}
