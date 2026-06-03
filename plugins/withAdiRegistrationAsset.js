// plugins/withAdiRegistrationAsset.js

const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('@expo/config-plugins');

module.exports = function withAdiRegistrationAsset(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const sourceFile = path.join(
        config.modRequest.projectRoot,
        'assets',
        'adi-registration.properties'
      );

      const androidAssetsDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets'
      );

      const targetFile = path.join(
        androidAssetsDir,
        'adi-registration.properties'
      );

      if (!fs.existsSync(sourceFile)) {
        throw new Error(`ADI registration file not found at: ${sourceFile}`);
      }

      fs.mkdirSync(androidAssetsDir, { recursive: true });
      fs.copyFileSync(sourceFile, targetFile);

      return config;
    },
  ]);
};