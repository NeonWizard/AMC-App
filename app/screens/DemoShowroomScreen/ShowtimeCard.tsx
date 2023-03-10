import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing } from "../../theme"
import { Text } from "../../components/Text"
import { Showtime } from "../../models/Showtime"
import { Card } from "../../components"

export interface ShowtimeCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  showtime: Showtime

  crossedOff?: boolean
}

export const ShowtimeCard = observer(function ShowtimeCard(props: ShowtimeCardProps) {
  const { style, showtime } = props
  const $styles = [$container, style]

  const getTime = () => {
    let seconds: number
    let prefix: string

    if (showtime.startTime > new Date()) {
      seconds = (showtime.startTime.getTime() - new Date().getTime()) / 1000
      prefix = "in"
    } else {
      seconds = (showtime.endTime.getTime() - new Date().getTime()) / 1000
      prefix = "ends in"
    }

    if (seconds < 0) {
      return "completed"
    }

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)

    return `${prefix} ${String(h).padStart(2, "0")}h:${String(m).padStart(2, "0")}m`
  }

  // TODO: Update time remaining every minute

  return (
    <Card
      style={[$styles, $crossedOff]}
      verticalAlignment="force-footer-bottom"
      HeadingComponent={
        <View style={$metadata}>
          <Text weight="semiBold" style={$metadataText} size="sm">
            {showtime.title}
          </Text>
          <Text style={$metadataText} size="xs">
            {getTime()}
          </Text>
        </View>
      }
      FooterComponent={
        <View style={$footer}>
          <View style={$footerLeft}>
            <Text style={$footerText} size="xxs">
              <Text>Start: </Text>
              {showtime.startString}
            </Text>
            <Text style={$footerText} size="xxs">
              <Text>End: </Text>
              {showtime.endString}
            </Text>
          </View>
          <Text weight="semiBold" style={$footerAuditorium} size="xs">
            {showtime.auditorium}
          </Text>
        </View>
      }
    />
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.extraSmall,
  flexDirection: "row",
  justifyContent: "space-between",
  marginStart: spacing.tiny,
}

const $metadataText: TextStyle = {
  color: colors.text,
  marginEnd: spacing.tiny,
  marginBottom: spacing.extraSmall,
}

const $footer: TextStyle = {
  color: colors.textDim,
  flexDirection: "row",
  justifyContent: "space-between",
}

const $footerLeft: TextStyle = {
  flexDirection: "row",
}

const $footerText: TextStyle = {
  color: colors.text,
  marginEnd: spacing.small,
  marginStart: spacing.tiny,
  marginBottom: spacing.extraSmall,
}

const $footerAuditorium: TextStyle = {
  marginEnd: spacing.tiny,
}

const $crossedOff: TextStyle = {
  color: "yellow",
}
