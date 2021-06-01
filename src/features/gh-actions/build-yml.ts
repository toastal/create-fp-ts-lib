import { Config } from '../../Config/type'
import { Json } from '../../Json'

export default (config: Config): Json => ({
  name: 'Test',
  on: {
    push: {
      branches: ['main', '$default-branch'],
    },
    pull_request: {
      branches: ['main', '$default-branch'],
    },
  },
  jobs: {
    build: {
      'runs-on': 'ubuntu-latest',
      strategy: {
        matrix: {
          'node-version': ['12.x', '14.x', '15.x'],
        },
      },
      steps: [
        {
          uses: 'actions/checkout@v2',
        },
        {
          name: 'Use Node.js ${{ matrix.node-version }}',
          uses: 'actions/setup-node@v1',
          with: {
            'node-version': '${{ matrix.node-version }}',
          },
        },
        { run: 'yarn install' },
        { run: 'yarn build' },
        ...(config.jest ? [{ run: `${config.packageManager} run test` }] : []),
        ...(config.eslint
          ? [{ run: `${config.packageManager} run lint` }]
          : []),
      ],
    },
  },
})
