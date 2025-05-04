import { Request } from "express";
import { ValidationError } from "src/utils/errors";
import Validator from "validatorjs";

export default class {
    constructor() { }
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
}
