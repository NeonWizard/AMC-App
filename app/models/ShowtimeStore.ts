import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ShowtimeModel } from "./Showtime"

export const ShowtimeStoreModel = types
  .model("ShowtimeStore")
  .props({
    showtimes: types.array(ShowtimeModel),
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
  }))
  .views((store) => ({
    get showtimesForList() {
      if (store.upcomingOnly) {
        return store.showtimes.filter((showtime) => showtime.endTime > new Date())
      } else {
        return store.showtimes
      }
    },
  }))

export interface ShowtimeStore extends Instance<typeof ShowtimeStoreModel> {}
export interface ShowtimeStoreSnapshot extends SnapshotOut<typeof ShowtimeStoreModel> {}
