import React, { FC, useEffect, useRef, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { DrawerLayout, DrawerState, RefreshControl } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { Card, Header, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { TabScreenProps } from "../../navigators/DemoNavigator"
import { colors, spacing } from "../../theme"
import { delay } from "../../utils/delay"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import { DrawerIconButton } from "./DrawerIconButton"
import { ShowtimeCard } from "./ShowtimeCard"

const logo = require("../../../assets/images/logo.png")

export interface SidebarSection {
  name: string
  options: {
    name: string
    callback: () => void
  }[]
}

const SidebarSections: SidebarSection[] = [
  {
    name: "Primary",
    options: [
      {
        name: "Settings",
        callback: () => null,
      },
    ],
  },
  {
    name: "Account",
    options: [
      {
        name: "Account Info",
        callback: () => null,
      },
      {
        name: "Logout",
        callback: () => null,
      },
    ],
  },
]

const SidebarSectionElement: FC<SidebarSection> = ({ name, options }) => {
  return (
    <View>
      <View style={$menuContainer}>
        <Text preset="bold">{name}</Text>
      </View>
      {options.map((option) => {
        return (
          <Text key={`${name}-${option.name}`} onPress={option.callback} style={$menuOption}>
            {option.name}
          </Text>
        )
      })}
    </View>
  )
}

export const HomeScreen: FC<TabScreenProps<"Home">> = function HomeScreen(_props) {
  const { showtimeStore } = useStores()

  const [open, setOpen] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false)

  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const drawerRef = useRef<DrawerLayout>()
  const menuRef = useRef<FlatList>()
  const progress = useSharedValue(0)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      await showtimeStore.fetchShowtimes()
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

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current)
  }, [])

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

          <FlatList<SidebarSection>
            ref={menuRef}
            contentContainerStyle={$flatListContentContainer}
            data={SidebarSections}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <SidebarSectionElement name={item.name} options={item.options} />
            )}
          />
        </View>
      )}
    >
      <Screen preset="fixed" contentContainerStyle={$screenContainer}>
        <Header
          title="AMC Goob Corp"
          RightActionComponent={<DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} />}
          style={$heading}
        />
        <ScrollView
          style={$sectionListContentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={manualRefresh}></RefreshControl>
          }
        >
          {/* MAIN CONTENT */}
          <Card
            preset="reversed"
            ContentComponent={
              <Text weight="semiBold" size="xxl" style={$trafficText}>
                HIGH
              </Text>
            }
            verticalAlignment="center"
            style={$trafficContainerStyle}
            alignmentWrapperStyle={$trafficContainerAlignmentStyle}
          />
          <Text preset="heading" style={$headerText}>
            Upcoming Showtimes
          </Text>
          <View>
            {showtimeStore.upcomingShowtimes.length > 0 && (
              <ShowtimeCard
                showtime={showtimeStore.upcomingShowtimes[0]}
                style={$showtimeCard}
              ></ShowtimeCard>
            )}
            {showtimeStore.upcomingShowtimes.length > 1 && (
              <ShowtimeCard
                showtime={showtimeStore.upcomingShowtimes[1]}
                style={$showtimeCard}
              ></ShowtimeCard>
            )}
            {showtimeStore.upcomingShowtimes.length > 2 && (
              <ShowtimeCard
                showtime={showtimeStore.upcomingShowtimes[2]}
                style={$showtimeCard}
              ></ShowtimeCard>
            )}
          </View>
        </ScrollView>
      </Screen>
    </DrawerLayout>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
}

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
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

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.extraSmall,
  paddingTop: spacing.large,
}

const $headerText: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.medium,
  marginTop: spacing.medium,
}

const $trafficContainerStyle: TextStyle = {
  backgroundColor: "#d33",
}

const $trafficText: TextStyle = {
  color: "white",
}

const $trafficContainerAlignmentStyle: TextStyle = {
  alignItems: "center",
}

const $showtimeCard: TextStyle = {
  marginBottom: spacing.small,
}

const $menuOption: TextStyle = {
  marginBottom: spacing.micro,
}
