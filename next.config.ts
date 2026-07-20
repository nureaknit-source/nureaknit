import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["semirigorously-branchial-margit.ngrok-free.dev"]
};

export default withPayload(nextConfig);
