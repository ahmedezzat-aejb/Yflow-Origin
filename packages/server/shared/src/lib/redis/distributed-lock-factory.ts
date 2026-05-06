import { Mutex } from 'async-mutex'
import { FastifyBaseLogger } from 'fastify'
import Redis from 'ioredis'

export const distributedLockFactory = (
    _createRedisConnection: () => Promise<Redis>,
) => {
    const locks = new Map<string, Mutex>()
    const locksMutex = new Mutex()

    const getOrCreateLock = async (key: string): Promise<Mutex> => locksMutex.runExclusive(() => {
        const existingLock = locks.get(key)
        if (existingLock) {
            return existingLock
        }
        const lock = new Mutex()
        locks.set(key, lock)
        return lock
    })

    return (_log: FastifyBaseLogger) => ({
        runExclusive: async <T>({
            key,
            fn,
        }: RunExclusiveParams<T>): Promise<T> => {
            const lock = await getOrCreateLock(key)
            return lock.runExclusive(fn)
        },
        destroy: async (): Promise<void> => {
            locks.clear()
        },
    })
}

type RunExclusiveParams<T> = {
    key: string
    timeoutInSeconds: number
    fn: () => Promise<T>
}
