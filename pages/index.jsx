import {
  AttachmentIcon,
  DeleteIcon,
  DownloadIcon,
  SettingsIcon,
} from "@chakra-ui/icons"
import {
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Image,
  Spinner,
  Tooltip,
} from "@chakra-ui/react"
import { useMachine } from "@xstate/react"
import Head from "next/head"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { assign, createMachine } from "xstate"

import Footer from "../components/Footer"
import Header from "../components/Header"

const fetchMachine = createMachine({
  id: "Level Up Image API",
  initial: "idle",
  context: {
    uploadedImageUrl: null,
    uploadedImageType: null,
    resizedImage: null,
    imageId: null,
  },
  states: {
    idle: {
      on: {
        UPLOAD: {
          target: "uploading",
          actions: assign((_, { file }) => {
            const url = URL.createObjectURL(file)

            return {
              uploadedImageUrl: url,
              uploadedImageType: file.type,
            }
          }),
        },
      },
    },
    uploading: {
      invoke: {
        async src(_, { file }) {
          const formData = new FormData()

          formData.append("file", file)

          return fetch("/api/upload", { method: "POST", body: formData })
            .then((res) => res.json())
            .then((json) => {
              if (!json.id) throw new Error("Can't upload image")

              return json
            })
        },
        onError: {
          target: "idle",
          actions: assign({
            uploadedImageUrl: null,
            uploadedImageType: null,
          }),
        },
        onDone: {
          target: "uploaded",
          actions: assign({
            imageId: (_, { data }) => data.id,
          }),
        },
      },
    },
    uploaded: {
      on: {
        REMOVE_UPLOADED: {
          target: "idle",
          actions: assign({
            uploadedImageUrl: null,
            uploadedImageType: null,
            imageId: null,
          }),
        },
        RESIZE: {
          target: "resizing",
        },
      },
    },
    resizing: {
      invoke: {
        src: ({ imageId }) =>
          fetch("/api/resize", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ imageId }),
          })
            .then((res) => res.arrayBuffer())
            .then((arrayBuffer) => {
              const decoder = new TextDecoder()

              try {
                JSON.parse(decoder.decode(arrayBuffer))
              } catch {
                return arrayBuffer
              }

              throw new Error("Can't resize image")
            }),
        onDone: {
          target: "resized",
          actions: assign({
            resizedImage: (ctx, { data }) => {
              const blob = new Blob([data], { type: ctx.uploadedImageType })

              return URL.createObjectURL(blob)
            },
          }),
        },
        onError: {
          target: "uploaded",
        },
      },
    },
    resized: {
      on: {
        REMOVE_RESIZED: {
          target: "idle",
          actions: assign({
            uploadedImageUrl: null,
            uploadedImageType: null,
            resizedImage: null,
            imageId: null,
          }),
        },
      },
    },
  },
})

export default function IndexPage() {
  const { t } = useTranslation("common")

  const [state, send] = useMachine(fetchMachine)

  const onDrop = useCallback(async (acceptedFiles) => {
    send("UPLOAD", {
      file: acceptedFiles[0],
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  let body = null

  switch (state.value) {
    case "idle":
      body = (
        <Center
          flex="1"
          {...getRootProps()}
          borderColor="gray.300"
          borderStyle="dashed"
          borderWidth={3}
          display="flex"
          flexDirection="column"
          cursor="pointer"
        >
          <input {...getInputProps()} multiple={false} />
          <AttachmentIcon mb={1} fontSize={30} />
          {t("click-or-drag")}
        </Center>
      )
      break
    case "uploading":
      body = (
        <Center flex="1">
          <Spinner />
        </Center>
      )

      break
    case "uploaded":
      body = (
        <>
          <Flex mb={2} justifyContent="center">
            <Tooltip label={t("delete-image")}>
              <IconButton
                aria-label={t("delete-image")}
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
                onClick={() => send("REMOVE_UPLOADED")}
                mr={2}
              />
            </Tooltip>
            <Button
              colorScheme="green"
              rightIcon={<SettingsIcon />}
              onClick={() => send("RESIZE")}
            >
              {t("enhance-image")}
            </Button>
          </Flex>
          <Image
            src={state.context.uploadedImageUrl}
            objectFit="contain"
            height="auto"
            minHeight={0}
            flex="1"
          />
        </>
      )
      break
    case "resizing":
      body = (
        <>
          <Flex mb={2} justifyContent="center">
            <IconButton
              aria-label={t("delete-image")}
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              mr={2}
              disabled
            />
            <Button
              colorScheme="green"
              rightIcon={<SettingsIcon />}
              loadingText={t("loading")}
              isLoading
            >
              {t("enhance-image")}
            </Button>
          </Flex>
          <Image
            src={state.context.uploadedImageUrl}
            objectFit="contain"
            height="auto"
            minHeight={0}
            flex="1"
          />
        </>
      )
      break
    case "resized":
      body = (
        <>
          <Flex mb={2} justifyContent="center">
            <Tooltip label={t("delete-image")}>
              <IconButton
                aria-label={t("delete-image")}
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
                onClick={() => send("REMOVE_RESIZED")}
                mr={2}
              />
            </Tooltip>
            <Button
              colorScheme="green"
              type="button"
              rightIcon={<DownloadIcon />}
              as="a"
              href={state.context.resizedImage}
              download
            >
              {t("download")}
            </Button>
          </Flex>
          <Image
            src={state.context.resizedImage}
            objectFit="contain"
            height="auto"
            minHeight={0}
            flex="1"
          />
        </>
      )
      break
    default:
      throw new Error("Unknown machine state")
  }

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("description")} />
        <meta name="keywords" content={t("keywords")} />
      </Head>
      <Container
        maxW="container.md"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Header />
        {body}
        <Footer />
      </Container>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  }
}
