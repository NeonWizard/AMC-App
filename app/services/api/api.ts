/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line
import { ShowtimeSnapshotIn } from "../../models/Showtime"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      console.log(rawData.items)

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
        ...raw,
      }))

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  // @demo remove-block-end

  async getShowtimes(): Promise<
    { kind: "ok"; showtimes: ShowtimeSnapshotIn[] } | GeneralApiProblem
  > {
    try {
      // Mock data, TODO
      const showtimes: ShowtimeSnapshotIn[] = [
        {
          title: "goog morning",
          startTime: new Date().setMinutes(new Date().getMinutes() - 590),
          endTime: new Date().setMinutes(new Date().getMinutes() - 563),
          auditorium: 1,
          description: "",
        },
        {
          title: "What where am I",
          startTime: new Date().setMinutes(new Date().getMinutes() - 300),
          endTime: new Date().setMinutes(new Date().getMinutes() - 100),
          auditorium: 8,
          description: "",
        },
        {
          title: "Matrix 8",
          startTime: new Date().setMinutes(new Date().getMinutes() - 35),
          endTime: new Date().setMinutes(new Date().getMinutes() + 79),
          auditorium: 7,
          description: "",
        },
        {
          title: "Why North Korea is Great",
          startTime: new Date().setMinutes(new Date().getMinutes() - 14),
          endTime: new Date().setMinutes(new Date().getMinutes() + 123),
          auditorium: 12,
          description: "hallo eviryone north korea",
        },
        {
          title: "Crasy: Loco",
          startTime: new Date().setMinutes(new Date().getMinutes() + 7),
          endTime: new Date().setMinutes(new Date().getMinutes() + 140),
          auditorium: 4,
          description: "",
        },
        {
          title: "Matrix 8",
          startTime: new Date().setMinutes(new Date().getMinutes() + 109),
          endTime: new Date().setMinutes(new Date().getMinutes() + 253),
          auditorium: 7,
          description: "",
        },
        {
          title: "Aliens with lazerz",
          startTime: new Date().setMinutes(new Date().getMinutes() + 450),
          endTime: new Date().setMinutes(new Date().getMinutes() + 599),
          auditorium: 3,
          description: "these aliens got big laserz mann",
        },
      ]

      return { kind: "ok", showtimes }
    } catch (e) {
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
