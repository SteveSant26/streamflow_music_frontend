const sonarqubeScanner = require('sonarqube-scanner');
require('dotenv').config();

sonarqubeScanner(
  {
    serverUrl: process.env.SONAR_HOST_URL || 'https://sonarcloud.io',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectKey': 'SteveSant26_streamflow_music_frontend',
      'sonar.organization': 'stevesant26',
      'sonar.projectName': 'StreamFlow Music Frontend',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src/app',
      'sonar.tests': 'src/app',
      'sonar.test.inclusions': '**/*.spec.ts',
      'sonar.exclusions': '**/*.spec.ts,**/node_modules/**,**/coverage/**,**/*.e2e.ts,**/dist/**,**/public/**,**/environments/**',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.typescript.node': 'node',
      'sonar.javascript.lcov.reportPaths': 'coverage/frontend/lcov.info',
      'sonar.typescript.lcov.reportPaths': 'coverage/frontend/lcov.info',
      'sonar.coverage.exclusions': '**/*.spec.ts,**/*.e2e.ts,**/main.ts,**/main.server.ts,**/server.ts,**/environments/**,**/testing/**'
    }
  },
  (error) => {
    if (error) {
      console.error('SonarQube analysis failed:', error);
      process.exit(1);
    }
    console.log('✅ SonarQube analysis completed successfully!');
  }
);
