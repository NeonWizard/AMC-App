/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type { ApiConfig } from "./api.types"
import { ShowtimeSnapshotIn } from "../../models/Showtime"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  api_key: Config.API_KEY,
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
        "X-AMC-Vendor-Key": this.config.api_key,
      },
    })
  }

  /**
   * Gets a list of today's movie showtimes
   */
  async getShowtimes(): Promise<
    { kind: "ok"; showtimes: ShowtimeSnapshotIn[] } | GeneralApiProblem
  > {
    // -- AMC devs smell bad and won't authorize my token
    // const response: ApiResponse<AMCAPIResponse> = await this.apisauce.get(
    //   `theatres/${Config.THEATER_ID}/showtimes`,
    // )

    // if (!response.ok) {
    //   const problem = getGeneralApiProblem(response)
    //   console.log(problem)
    //   if (problem) return problem
    // }

    try {
      // Mock data, TODO
      const showtimes: ShowtimeSnapshotIn[] = [
        {
          uid: "goog morning-1",
          title: "goog morning",
          startTime: new Date().setHours(9, 35), // 9:35am
          endTime: new Date().setHours(11, 28), // 11:28am
          auditorium: 1,
          description: "Good morning!!",
        },
        {
          uid: "what-1",
          title: "What where am I",
          startTime: new Date().setHours(9, 59), // 9:59am
          endTime: new Date().setHours(15, 44), // 3:44pm
          auditorium: 8,
          description: "how did i get here",
        },
        {
          uid: "matrix-1",
          title: "Matrix 8",
          startTime: new Date().setHours(10, 15), // 10:15am
          endTime: new Date().setHours(11, 22), // 11:22am
          auditorium: 7,
          description: "Slightly worse than Matrix 7",
        },
        {
          uid: "north korea-1",
          title: "Why North Korea is Great",
          startTime: new Date().setHours(13, 0), // 1:00pm
          endTime: new Date().setHours(16, 37), // 4:37pm
          auditorium: 12,
          description: "hallo eviryone north korea",
        },
        {
          uid: "crasy-1",
          title: "Crasy: Loco",
          startTime: new Date().setHours(13, 30), // 1:30pm
          endTime: new Date().setHours(15, 37), // 3:37pm
          auditorium: 4,
          description: "crasy. loco even",
        },
        {
          uid: "matrix-2",
          title: "Matrix 8",
          startTime: new Date().setHours(15, 20), // 3:20pm
          endTime: new Date().setHours(16, 27), // 4:27pm
          auditorium: 7,
          description: "Slightly worse than Matrix 7",
        },
        {
          uid: "aliens-1",
          title: "Aliens with lazerz",
          startTime: new Date().setHours(21, 30), // 9:30pm
          endTime: new Date().setHours(23, 26), // 11:26pm
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
