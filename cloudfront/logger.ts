import * as bunyan from 'bunyan';
import BunyanCloudWatch from 'bunyan-cloudwatch';

const logger = bunyan.createLogger({
  name: 'one-hundred-letters-auth-at-edge-logger',
  level: (process.env.LOG_LEVEL as bunyan.LogLevel) || 'info',
  serializers: bunyan.stdSerializers,
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'error',
      type: 'raw',
      stream: BunyanCloudWatch({
        logGroupName: '/aws/lambda/one-hundred-letters-auth-at-edge-log-group',
        logStreamName: 'one-hundred-letters-auth-at-edge-log-stream',
        awsRegion: 'us-east-1',
      }),
    },
  ],
});

export { logger };
