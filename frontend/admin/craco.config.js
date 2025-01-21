const path = require('path');

module.exports = {
    webpack: {
      alias: {
        '@services': path.resolve(__dirname, 'src/services/'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
        '@models': path.resolve(__dirname, 'src/Models/'),
        '@hooks': path.resolve(__dirname, 'src/hooks/'),
        '@helpers': path.resolve(__dirname, 'src/helpers/'),
        '@styles': path.resolve(__dirname, 'src/styles/'),
        '@contexts': path.resolve(__dirname, 'src/contexts/'),
        '@theme': path.resolve(__dirname, 'src/theme/'),

        // other custom aliases or webpack settings
      },
    },
  };
