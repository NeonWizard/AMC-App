import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { translate } from "../i18n"

/**
 * This represents an episode of React Native Radio.
 */
export const ShowtimeModel = types
  .model("Showtime")
  .props({
    // uid: types.identifier,
    title: "",
    startTime: types.Date,
    endTime: types.Date,
    auditorium: types.integer,
    description: "",
  })
  .actions(withSetPropAction)
  .views((model) => ({
    get startString() {
      // TODO
      return ""
    },
    get endString() {
      // TODO
      return ""
    },
    get audString() {
      return `Auditorium ${model.auditorium}`
    },
    get duration() {
      // TODO
      const seconds = Number(model.endTime) - Number(model.startTime)
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = Math.floor((seconds % 3600) % 60)

      const hDisplay = h > 0 ? `${h}:` : ""
      const mDisplay = m > 0 ? `${m}:` : ""
      const sDisplay = s > 0 ? s : ""
      return {
        textLabel: hDisplay + mDisplay + sDisplay,
        accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {
          hours: h,
          minutes: m,
          seconds: s,
        }),
      }
    },
  }))

export interface Showtime extends Instance<typeof ShowtimeModel> {}
export interface ShowtimeSnapshotOut extends SnapshotOut<typeof ShowtimeModel> {}
export interface ShowtimeSnapshotIn extends SnapshotIn<typeof ShowtimeModel> {}
