import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ShowtimeModel } from "./Showtime"

export const ShowtimeStoreModel = types
  .model("ShowtimeStore")
  .props({
    showtimes: types.array(ShowtimeModel),
    upcomingOnly: false,
    // favorites: types.array(types.reference(ShowtimeModel)),
    // favoritesOnly: false,
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
    // addFavorite(episode: Episode) {
    //   store.favorites.push(episode)
    // },
    // removeFavorite(episode: Episode) {
    //   store.favorites.remove(episode)
    // },
  }))
  .views((store) => ({
    get showtimesForList() {
      // return store.favoritesOnly ? store.favorites : store.episodes
      return store.showtimes
    },
    // }))
    // .actions((store) => ({
    // toggleFavorite(episode: Episode) {
    //   if (store.hasFavorite(episode)) {
    //     store.removeFavorite(episode)
    //   } else {
    //     store.addFavorite(episode)
    //   }
    // },
  }))

export interface ShowtimeStore extends Instance<typeof ShowtimeStoreModel> {}
export interface ShowtimeStoreSnapshot extends SnapshotOut<typeof ShowtimeStoreModel> {}
