import { JsonResource } from ".";

/**
 * Admin/CategoryResource
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
