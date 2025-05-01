import { JsonResource } from ".";

export default class extends JsonResource {
    /**
     * Build the response object
     * @returns this
     */
    data () {
        return {
            id: this.id,
            email: this.email,
        }
    }
}
