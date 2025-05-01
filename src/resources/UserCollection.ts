import { ApiResource, JsonResource, Resource } from ".";

import UserResource from "./UserResource";

export default class extends JsonResource<Resource[] | Resource> {
    /**
     * Build the response object
     * @returns this
     */
    data () {
        const data = Array.isArray(this.resource) ? this.resource : this.resource.data

        return {
            data: data.map(
                (e: Resource) => ApiResource(new UserResource(this.request, this.response, e)).data()
            )
        }
    }
}
