import React, { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"

export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoPodcastListScreen(_props) {
    // const { showtimeStore } = useStores()

    // const [refreshing, setRefreshing] = React.useState(false)
    // const [isLoading, setIsLoading] = React.useState(false)

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title}>
          Traffic (WIP)
        </Text>
        <Text style={$tagline}>Come back later!</Text>
      </Screen>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingHorizontal: spacing.large,
}

const $title: TextStyle = {
  marginBottom: spacing.small,
}

const $tagline: TextStyle = {
  marginBottom: spacing.huge,
}
