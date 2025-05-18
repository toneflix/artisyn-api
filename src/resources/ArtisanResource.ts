import { JsonResource } from ".";

/**
 * Curator/ArtisanResource
 */
export default class extends JsonResource {
    /**
     * Build the response object
     * @returns this
     */
    data () {
        return this.resource
    }
}
