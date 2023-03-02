import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

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
      const hour = String(model.startTime.getHours() % 12).padStart(2, "0")
      const minute = String(model.startTime.getMinutes()).padStart(2, "0")
      const ampm = model.startTime.getHours() > 12 ? "pm" : "am"
      return `${hour}:${minute}${ampm}`
    },
    get endString() {
      const hour = String(model.endTime.getHours() % 12).padStart(2, "0")
      const minute = String(model.endTime.getMinutes()).padStart(2, "0")
      const ampm = model.endTime.getHours() > 12 ? "pm" : "am"
      return `${hour}:${minute}${ampm}`
    },
    get audString() {
      return `Auditorium ${model.auditorium}`
    },
    get duration() {
      const seconds = (model.endTime.getTime() - model.startTime.getTime()) / 1000
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)

      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    },
  }))

export interface Showtime extends Instance<typeof ShowtimeModel> {}
export interface ShowtimeSnapshotOut extends SnapshotOut<typeof ShowtimeModel> {}
export interface ShowtimeSnapshotIn extends SnapshotIn<typeof ShowtimeModel> {}
