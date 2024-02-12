/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: { 'dev': true, 'prod': false }[process.env.STAGE],
}

module.exports = nextConfig
