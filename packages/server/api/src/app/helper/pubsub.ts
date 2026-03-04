import { pubsubFactory } from '@yflow/server-shared'
import { redisConnections } from '../database/redis-connections'

export const pubsub = pubsubFactory(redisConnections.create)
