import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { createTransport, Transporter } from 'nodemailer'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    @Inject(RedisService)
    private transporter: Transporter

    constructor(private readonly configService: ConfigService) {
        this.transporter = createTransport({
            host: this.configService.get('email_smtp_host'),
            port: this.configService.get('email_smtp_port'),
            secureConnection: true,
            ssl: true,
            auth: {
                user: this.configService.get('email_smtp_user'),
                pass: this.configService.get('email_smtp_pass'),
            },
        })
    }

    /**
     * 发送邮件
     * @param param
     */
    async sendMail({ name, to, subject, html }) {
        try {
            await this.transporter && this.transporter.sendMail({
                from: {
                    name: name,
                    address: this.configService.get('email_smtp_user'),
                },
                to,
                subject,
                html
            })
            return '发送成功'
        } catch (error) {
            return '发送失败，请检查邮箱'
        }
    }

}

