import { InitialRules, make, register, setTranslationObject } from "simple-body-validator";

import { PrismaClient } from "@prisma/client";
import { ValidationError } from "./errors";

type InferInput<X, A extends boolean = false> = A extends true
    ? Promise<{ [P in keyof X]: any }>
    : { [P in keyof X]: any }

const modelExists = async (rule: 'unique' | 'exists', value: any, field: string, modelName?: string) => {
    const prisma = new PrismaClient();

    try {
        if (!modelName) {
            console.log(`The ${rule} validation rule requires a model name`);
            return false
        }

        const model: { count: (q: any) => Promise<number> } = (prisma as any)[modelName]
        const count = await model.count({ where: { [field]: value } })

        return count >= 1
    } catch (error) {
        console.log(`Could not load ${rule} rule`, error);
        return false;
    }
}

setTranslationObject({
    en: {
        unique: 'The selected :attribute is not available.',
        exists: 'The selected :attribute does not exist.',
    }
});

register('unique', async function (value, parameters, attribute) {
    const [modelName, field] = parameters ?? [];
    return (await modelExists('exists', value, field ?? attribute, modelName)) === false
});

register('exists', async function (value, parameters, attribute) {
    const [modelName, field] = parameters ?? [];
    return (await modelExists('exists', value, field ?? attribute, modelName)) === true
});

const validator = <X extends InitialRules, A extends boolean = false> (
    data: { [key: string]: any },
    rules: X,
    async: A
): InferInput<X, A> => {

    const validator = make()
        .setData(data)
        .setRules(rules);

    const castValue = (value: any, fieldRules: string[]): any => {
        if (fieldRules.includes('boolean')) {
            return ['1', 1, true, 'true'].includes(value) ? true : false;
        }
        if (fieldRules.includes('integer') || fieldRules.includes('numeric')) {
            return parseInt(value, 10) || 0; // Fallback to 0 if invalid
        }
        return String(value); // Default to string
    };

    const ouputData = () => {
        const result = {} as InferInput<X, false>;

        for (const key of Object.keys(rules) as (keyof X)[]) {
            if (data[key as string] !== undefined) {
                const fieldRules = Array.isArray(rules[key]) ? rules[key] : rules[key].toString().split('|');
                result[key] = castValue(data[key as string], fieldRules);
            }
        }

        return result;
    }

    const respond = (isValid: boolean) => {
        if (!isValid) {
            const errors = validator.errors();

            const count = errors.keys().length
            let message = errors.firstMessage || 'Unknown Error'
            message += count > 1 ? ` And ${count - 1} other error(s).` : ''

            throw new ValidationError(message, errors.all());
        }
    }

    if (async) {
        return (async () => {
            respond(await validator.validateAsync())
            return ouputData()
        })() as InferInput<X, A>
    } else {
        respond(validator.validate())
        return ouputData()
    }
}

export const validate = <X extends InitialRules> (
    data: { [key: string]: any },
    rules: X
) => validator(data, rules, false)

export const validateAsync = async <X extends InitialRules> (
    data: { [key: string]: any },
    rules: X
) => await validator(data, rules, true)
