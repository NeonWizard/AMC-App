import React, { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { TabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"

export const BreakFinderScreen: FC<TabScreenProps<"BreakFinder">> = function BreakFinderScreen(
  _props,
) {
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <Text preset="heading" style={$title}>
        Break Finder (WIP)
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
