import { env, secureOtp } from "./helpers";

import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

export const googleStrategy = () => {
    return new GoogleStrategy({
        clientID: env('GOOGLE_CLIENT_ID'),
        clientSecret: env('GOOGLE_CLIENT_SECRET'),
        callbackURL: env('GOOGLE_CALLBACK'),
        scope: ['profile']
    },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                const email = profile.emails?.find(e => !!e.value)?.value!
                const user = await prisma.user.findFirst({
                    where: { googleId: profile.id },
                    include: { curator: true }
                })
                if (user) {
                    return cb(undefined, user!);
                }
                const cUser = await prisma.user.create({
                    data: {
                        firstName: profile.name?.givenName ?? '',
                        lastName: profile.name?.familyName ?? '',
                        email: email ?? `${profile.id}@gmail.com`,
                        password: await argon2.hash(secureOtp(32)),
                        googleId: profile.id,
                    },
                    include: { curator: true }
                })
                return cb(undefined, cUser);
            } catch (error) {
                return cb(error);
            }
        }
    )
}

export const facebookStrategy = () => {
    const clientID = env('FACEBOOK_CLIENT_ID');
    const clientSecret = env('FACEBOOK_CLIENT_SECRET');
    const callbackURL = env('FACEBOOK_CALLBACK');
    if (!clientID || !clientSecret) {
        // Skip Facebook strategy if not configured
        return null;
    }
    return new FacebookStrategy({
        clientID,
        clientSecret,
        callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email'],
    },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                const email = profile.emails?.find(e => !!e.value)?.value!
                const user = await prisma.user.findFirst({
                    where: { facebookId: profile.id },
                    include: { curator: true }
                })
                if (user) {
                    return cb(undefined, user!);
                }
                const cUser = await prisma.user.create({
                    data: {
                        firstName: profile.name?.givenName ?? '',
                        lastName: profile.name?.familyName ?? '',
                        email: email ?? `${profile.id}@facebook.com`,
                        password: await argon2.hash(secureOtp(32)),
                        facebookId: profile.id,
                    },
                    include: { curator: true }
                })
                return cb(undefined, cUser);
            } catch (error) {
                return cb(error);
            }
        }
    )
}
