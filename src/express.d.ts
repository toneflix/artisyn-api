import { IUser } from "./models/interfaces";

declare global {
    namespace Express {
        interface User extends IUser { }

        interface Request {
            user?: User | undefined;
            authToken?: string | undefined;
        }
    }
    interface String {
        titleCase (): string;
        camelCase (): string;
    }
}
