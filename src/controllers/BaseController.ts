import { RequestError, ValidationError } from "src/utils/errors";

import { Request } from "express";
import Validator from "validatorjs";

export default class {
    request?: Request | undefined;

    constructor(req?: Request) {
        this.request = req
    }

    validate<X extends Validator.Rules> (req: Request, rules: X): { [P in keyof X]: string } {

        let validator = new Validator(req.body, rules);

        if (validator.fails()) {
            let message = validator.errors.first(Object.keys(validator.errors.errors).at(0)!) || 'Unknown Error'
            message += validator.errorCount > 1 ? ` And ${validator.errorCount - 1} other errors.` : ''
            throw new ValidationError(message, validator.errors.errors);
        }

        return Object
            .keys(validator.rules)
            .filter(cur => typeof validator.input[cur] !== 'undefined')
            .reduce((acc, cur) => {
                let value = validator.input[cur]

                // Check the expected value and cast as needed
                if (Array.isArray(validator.rules[cur])) {
                    const casts = validator.rules[cur].map((r: any) => r.name)

                    if (casts.includes('boolean')) {
                        value = ['1', 1, true, 'true'].includes(value)
                    }
                }

                return Object.assign({}, acc, { [cur]: value })
            }, {} as { [P in keyof X]: string })
    }

    pagination (req?: Request) {
        this.request = req

        // Get page and limit from query parameters, with defaults
        const page = parseInt(String(this.request?.query?.page)) || 1;
        const limit = parseInt(String(this.request?.query?.limit)) || 15;

        // Ensure valid inputs
        RequestError.abortIf(page < 1 || limit < 1, "Page and limit must be positive integers", 400)

        // Convert to Prisma pagination parameters
        const take = limit;
        const skip = (page - 1) * limit;
        const meta = (total: number, count: number) => ({
            perPage: limit,
            total,
            from: total > 0 ? skip + 1 : 0,
            to: Math.min(skip + count, total),
        })

        return { take, skip, meta }
    }
}
