import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

const tenantId = 'b86568af-753e-401e-a11c-b0f3af578639';
const backendClientId = '0e1a17ea-0f4e-4716-90fe-6caf985857d3';

const issuer =
    `https://login.microsoftonline.com/${tenantId}/v2.0`;

const jwks = createRemoteJWKSet(
    new URL(
        `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
    )
);

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export const validateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Bearer token missing"
            });
        }

        const token = authHeader.substring(7);

        // const claims = decodeJwt(token);
        // const header = decodeProtectedHeader(token);

        // console.log("ver:", claims.ver);
        // console.log("iss:", claims.iss);
        // console.log("aud:", claims.aud);
        // console.log("tid:", claims.tid);
        // console.log("scp:", claims.scp);
        // console.log("kid:", header.kid);

        const { payload } = await jwtVerify(token, jwks, {
            issuer,
            audience: backendClientId
        });

        const scopes = payload.scp?.toString().split(" ") ?? [];

        if (!scopes.includes("access_as_user")) {
            return res.status(403).json({
                message: "Required scope missing"
            });
        }

        console.log("Validated token:", payload);

        req.user = payload;

        next();

    } catch (error) {

        console.error("Token validation failed:", error);

        return res.status(401).json({
            message: "Invalid access token"
        });
    }
}
