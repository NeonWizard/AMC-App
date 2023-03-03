import { isRTL } from "expo-localization"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, FlatList, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { EmptyState, Screen, Text, Toggle } from "../components"
import { useStores } from "../models"
import { Showtime } from "../models/Showtime"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { delay } from "../utils/delay"
import { ShowtimeCard } from "./DemoShowroomScreen/ShowtimeCard"

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen(_props) {
    const { showtimeStore } = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await showtimeStore.fetchShowtimes()
        setIsLoading(false)
      })()
    }, [showtimeStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([showtimeStore.fetchShowtimes(), delay(750)])
      setRefreshing(false)
    }

    return (
      <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <FlatList<Showtime>
          data={showtimeStore.showtimesForList}
          // extraData={episodeStore.favorites.length + episodeStore.episodes.length}
          contentContainerStyle={$flatListContentContainer}
          refreshing={refreshing}
          onRefresh={manualRefresh}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                heading={showtimeStore.upcomingOnly ? "This looks a bit empty" : undefined}
                content={
                  showtimeStore.upcomingOnly
                    ? "There are no more upcoming showtimes today! Good job! :)"
                    : undefined
                }
                button={showtimeStore.upcomingOnly ? null : undefined}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading">Usher Schedule</Text>
              {(showtimeStore.upcomingOnly || showtimeStore.showtimesForList.length > 0) && (
                <View style={$toggle}>
                  <Toggle
                    value={showtimeStore.upcomingOnly}
                    onValueChange={() =>
                      showtimeStore.setProp("upcomingOnly", !showtimeStore.upcomingOnly)
                    }
                    variant="switch"
                    label="Only Show Upcoming"
                    labelPosition="left"
                    labelStyle={$labelStyle}
                  />
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => <ShowtimeCard showtime={item} style={$showtimeCard} />}
        />
      </Screen>
    )
  }

const $container: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
}

const $toggle: ViewStyle = {
  marginTop: spacing.medium,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $showtimeCard: TextStyle = {
  marginBottom: spacing.tiny,
}
