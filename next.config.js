/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: { 'dev': true, 'prod': false }[process.env.STAGE],
	webpack: (config, options) => {
		if (!options.dev) {
			config.devtool = "source-map";
		}
		return config;
	},
}

module.exports = nextConfig
