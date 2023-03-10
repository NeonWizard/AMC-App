import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Showtime, ShowtimeModel } from "./Showtime"

export const ShowtimeStoreModel = types
  .model("ShowtimeStore")
  .props({
    showtimes: types.array(ShowtimeModel),
    sortType: 0,
    crossedOff: types.array(types.reference(ShowtimeModel)),
    notFinishedOnly: false,
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
      // Start Time
      if (store.sortType === 0) {
        if (store.notFinishedOnly) {
          return store.showtimes.filter((showtime) => showtime.startTime > new Date())
        } else {
          return [...store.showtimes].sort((showtimeA, showtimeB) => {
            return showtimeA.startTime.getTime() - showtimeB.startTime.getTime()
          })
        }
      }
      // End Time
      else if (store.sortType === 1) {
        if (store.notFinishedOnly) {
          return store.showtimes.filter((showtime) => showtime.endTime > new Date())
        } else {
          return [...store.showtimes].sort((showtimeA, showtimeB) => {
            return showtimeA.endTime.getTime() - showtimeB.endTime.getTime()
          })
        }
      }
      // Movie Name
      else if (store.sortType === 2) {
        if (store.notFinishedOnly) {
          return store.showtimes.filter((showtime) => showtime.startTime > new Date())
        } else {
          return [...store.showtimes].sort((showtimeA, showtimeB) => {
            return showtimeA.title < showtimeB.title ? -1 : 1
          })
        }
      }
      return store.showtimes
    },
    get upcomingShowtimes() {
      return store.showtimes.filter((showtime) => showtime.startTime > new Date())
    },

    isCrossedOff(showtime: Showtime) {
      return store.crossedOff.includes(showtime)
    },
  }))
  .actions((store) => ({
    toggleCrossedOff(showtime: Showtime) {
      if (store.isCrossedOff(showtime)) {
        store.uncrossOff(showtime)
      } else {
        store.crossOff(showtime)
      }
    },
  }))

export interface ShowtimeStore extends Instance<typeof ShowtimeStoreModel> {}
export interface ShowtimeStoreSnapshot extends SnapshotOut<typeof ShowtimeStoreModel> {}
