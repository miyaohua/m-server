import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType;

    /**
     * 添加key
     * @param key 健
     * @returns 
     */
    async get(key: string) {
        return await this.redisClient.get(key);
    }

    /**
     * 删除key
     * @param key 健
     * @returns 
     */
    async remove(key: string) {
        return await this.redisClient.del(key)
    }

    /**
     * 设置key
     * @param key 健
     * @param value 值
     * @param ttl 过期时间
     */
    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if (ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }

    /**
     * 获取key
     * @param key 健
     * @returns 
     */
    async getTtl(key: string) {
        return this.redisClient.ttl(key)
    }

}
