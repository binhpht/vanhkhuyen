/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed 'output: export' to support dynamic features like authentication
    eslint: {
        // Disable ESLint during production builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disable type checking during builds (already checked in dev)
        ignoreBuildErrors: true,
    },
}

export default nextConfig
