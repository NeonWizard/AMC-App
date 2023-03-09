import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { isRTL } from "expo-localization"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { DrawerLayout, DrawerState } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { EmptyState, Header, Screen, Text, Toggle } from "../components"
import { useStores } from "../models"
import { Showtime } from "../models/Showtime"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import { ShowtimeCard } from "./DemoShowroomScreen/ShowtimeCard"

const logo = require("../../assets/images/logo.png")

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> = observer(
  function DemoCommunityScreen(_props) {
    const { showtimeStore } = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [sortType, setSortType] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const progress = useSharedValue(0)

    const drawerRef = React.useRef<DrawerLayout>()

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

    const toggleDrawer = () => {
      if (!open) {
        setOpen(true)
        drawerRef.current?.openDrawer({ speed: 2 })
      } else {
        setOpen(false)
        drawerRef.current?.closeDrawer({ speed: 2 })
      }
    }

    const $drawerInsets = useSafeAreaInsetsStyle(["top"])

    return (
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={Platform.select({ default: 326, web: Dimensions.get("window").width * 0.3 })}
        drawerType={"slide"}
        drawerPosition={"right"}
        overlayColor={open ? colors.palette.overlay20 : "transparent"}
        onDrawerSlide={(drawerProgress) => {
          progress.value = open ? 1 - drawerProgress : drawerProgress
        }}
        onDrawerStateChanged={(newState: DrawerState, drawerWillShow: boolean) => {
          if (newState === "Settling") {
            progress.value = withTiming(drawerWillShow ? 1 : 0, {
              duration: 250,
            })
            setOpen(drawerWillShow)
          }
        }}
        renderNavigationView={() => (
          <View style={[$drawer, $drawerInsets]}>
            <View style={$logoContainer}>
              <Image source={logo} style={$logoImage} />
            </View>
          </View>
        )}
      >
        <Screen preset="fixed" contentContainerStyle={$container}>
          <Header
            title="AMC Goob Corp"
            RightActionComponent={
              <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />
            }
            style={$heading}
          />
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
                  heading={showtimeStore.notFinishedOnly ? "This looks a bit empty" : undefined}
                  content={
                    showtimeStore.notFinishedOnly
                      ? "There are no more upcoming showtimes today! Good job! :)"
                      : undefined
                  }
                  button={showtimeStore.notFinishedOnly ? null : undefined}
                  buttonOnPress={manualRefresh}
                  imageStyle={$emptyStateImage}
                  ImageProps={{ resizeMode: "contain" }}
                />
              )
            }
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading">Usher Schedule</Text>
                {(showtimeStore.notFinishedOnly || showtimeStore.showtimesForList.length > 0) && (
                  <View style={$toggle}>
                    <Toggle
                      value={showtimeStore.notFinishedOnly}
                      onValueChange={() =>
                        showtimeStore.setProp("notFinishedOnly", !showtimeStore.notFinishedOnly)
                      }
                      variant="switch"
                      label="Only Show Upcoming"
                      labelPosition="left"
                      labelStyle={$labelStyle}
                    />
                  </View>
                )}
                {showtimeStore.showtimesForList.length > 0 && (
                  <SegmentedControl
                    style={$segmentStyle}
                    values={["Start Time", "End Time", "Movie Name"]}
                    selectedIndex={sortType}
                    tintColor="#911"
                    onChange={(event) => {
                      setSortType(event.nativeEvent.selectedSegmentIndex)
                    }}
                  ></SegmentedControl>
                )}
              </View>
            }
            renderItem={({ item }) => <ShowtimeCard showtime={item} style={$showtimeCard} />}
          />
        </Screen>
      </DrawerLayout>
    )
  },
)

const $container: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  // paddingTop: spacing.large + spacing.extraLarge,
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

const $segmentStyle: TextStyle = {
  marginTop: spacing.medium,
}

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  height: 56,
  paddingHorizontal: spacing.large,
}
