import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing } from "../../theme"
import { Text } from "../../components/Text"
import { Showtime } from "../../models/Showtime"
import { Card } from "../../components"
import { useEffect, useState } from "react"

export interface ShowtimeCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  showtime: Showtime

  crossedOff?: boolean
  onCrossOff?: () => void
}

export const ShowtimeCard = observer(function ShowtimeCard(props: ShowtimeCardProps) {
  const { style, showtime, crossedOff, onCrossOff } = props
  const $styles = [$container, style]

  const [timeString, setTimeString] = useState("loading...")

  const getTimeString = () => {
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

  useEffect(() => {
    // Set initial time string for card
    setTimeString(getTimeString())

    // Compute updated time string every second
    const interval = setInterval(() => {
      setTimeString(getTimeString())
    }, 1000)

    // Clear interval on unmount
    return () => {
      clearInterval(interval)
    }
  }, [showtime])

  return (
    <Card
      style={[$styles, crossedOff ? $crossedOff : null]}
      verticalAlignment="force-footer-bottom"
      onPress={onCrossOff}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            weight="semiBold"
            style={[$metadataText, crossedOff ? $crossedOffText : null]}
            size="sm"
          >
            {showtime.title}
          </Text>
          <Text style={[$metadataText, crossedOff ? $crossedOffText : null]} size="xs">
            {timeString}
          </Text>
        </View>
      }
      FooterComponent={
        <View style={$footer}>
          <View style={$footerLeft}>
            <Text style={[$footerText, crossedOff ? $crossedOffText : null]} size="xxs">
              <Text style={crossedOff ? $crossedOffText : null}>Start: </Text>
              {showtime.startString}
            </Text>
            <Text style={[$footerText, crossedOff ? $crossedOffText : null]} size="xxs">
              <Text style={crossedOff ? $crossedOffText : null}>End: </Text>
              {showtime.endString}
            </Text>
          </View>
          <Text
            weight="semiBold"
            style={[$footerAuditorium, crossedOff ? $crossedOffText : null]}
            size="xs"
          >
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
  backgroundColor: colors.palette.neutral200,
}

const $crossedOffText: TextStyle = {
  textDecorationLine: "line-through",
  color: colors.palette.neutral300,
}
