// 默认response响应
export class BeCurrent<T = any> {
    code: number
    message: string
    data?: T

    constructor(code: number, message: string, data: any) {
        this.code = code;
        this.message = message;
        this.data = data || null
    }
}


// 待添加...(遇到不满足的条件下，可以自定义)