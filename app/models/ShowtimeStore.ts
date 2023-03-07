import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Showtime, ShowtimeModel } from "./Showtime"

export const ShowtimeStoreModel = types
  .model("ShowtimeStore")
  .props({
    showtimes: types.array(ShowtimeModel),
    crossedOff: types.array(types.reference(ShowtimeModel)),
    upcomingOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchShowtimes() {
      const response = await api.getShowtimes()
      if (response.kind === "ok") {
        store.setProp("showtimes", response.showtimes)
      } else {
        console.tron.error(`Error fetching showtimes: ${JSON.stringify(response)}`, [])
      }
    },
    crossOff(showtime: Showtime) {
      store.crossedOff.push(showtime)
    },
    uncrossOff(showtime: Showtime) {
      store.crossedOff.remove(showtime)
    },
  }))
  .views((store) => ({
    get showtimesForList() {
      if (store.upcomingOnly) {
        return store.showtimes.filter((showtime) => showtime.endTime > new Date())
      } else {
        return store.showtimes
      }
    },

    isCrossedOff(showtime: Showtime) {
      return store.crossedOff.includes(showtime)
    },
  }))
  .actions((store) => ({
    toggleFavorite(showtime: Showtime) {
      if (store.isCrossedOff(showtime)) {
        store.uncrossOff(showtime)
      } else {
        store.crossOff(showtime)
      }
    },
  }))

export interface ShowtimeStore extends Instance<typeof ShowtimeStoreModel> {}
export interface ShowtimeStoreSnapshot extends SnapshotOut<typeof ShowtimeStoreModel> {}
