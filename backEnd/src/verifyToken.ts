import express, { Request, Response, NextFunction } from 'express';
import {
    createRemoteJWKSet,
    jwtVerify,
    JWTPayload
} from "jose";

const tenantId = process.env.AZURE_TENANT_ID!;
const backendClientId = process.env.AZURE_BACKEND_CLIENT_ID!;

const issuer =
    `https://login.microsoftonline.com/${tenantId}/v2.0`;

const jwks = createRemoteJWKSet(
    new URL(
        `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
    )
);

interface AuthRequest extends Request {
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

        const { payload } = await jwtVerify(token, jwks, {
            issuer,
            audience: backendClientId
        });

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