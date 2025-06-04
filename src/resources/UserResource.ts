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
            walletAddress: this.walletAddress,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            avatar: this.avatar,
            bio: this.bio,
            phone: this.phone,
            curator: this.curator,
            verified: !!this.emailVerifiedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            locationId: this.locationId,
            preferences: this.preferences,
            privacySettings: this.privacySettings,
            profileCompletion: this.profileCompletion,
        }
    }
}
