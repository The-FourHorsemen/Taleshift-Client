/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@taleshift/asr-client",
    "@taleshift/alignment-engine",
    "@taleshift/nlp-layer",
    "@taleshift/leveling-engine",
    "@taleshift/db",
    "@taleshift/shared-types",
  ],
};

module.exports = nextConfig;
