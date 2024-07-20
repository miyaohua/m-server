/**
 * 用户注册模版
 * @param code 验证码
 * @returns string
 */
export const getRegistrySendEmail = (code: string) => {
    return `
          <div>
        <table cellpadding="0" align="center" style="
          width: 800px;
          height: 100%;
          margin: 0px auto;
          text-align: left;
          position: relative;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
          font-size: 14px;
          font-family: 微软雅黑, 黑体;
          line-height: 1.5;
          box-shadow: rgb(153, 153, 153) 0px 0px 5px;
          border-collapse: collapse;
          background-position: initial initial;
          background-repeat: initial initial;
          background: #fff;
        ">
            <tbody>
                <tr>
                    <th valign="middle" style="
                height: 25px;
                line-height: 25px;
                padding: 15px 35px;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #eee;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0px;
              ">
                        <font face="微软雅黑" size="5">欢迎您</font>
                    </th>
                </tr>
                <tr>
                    <td style="word-break: break-all">
                        <div style="
                  padding: 25px 35px 40px;
                  background-color: #fff;
                  opacity: 0.8;
                ">
                            <h2 style="margin: 5px 0px">
                                <font color="#333333" style="line-height: 20px">
                                    <font style="line-height: 22px" size="4"> 尊敬的用户</font>
                                </font>
                            </h2>
                            <!-- 中文 -->
                            <p>
                                您好！您的账号正在进行邮箱验证，验证码为：<font color="#ff8c00">${code}</font>，有效期5分钟，请尽快填写验证码完成验证！
                            </p>
                            <br />

                            <div style="width: 100%; margin: 0 auto">
                                <div style="
                      padding: 10px 10px 0;
                      border-top: 1px solid #ccc;
                      color: #747474;
                      margin-bottom: 20px;
                      line-height: 1.3em;
                      font-size: 12px;
                      text-align: right;
                    ">
                                    <br />
                                    <p>
                                        此为系统邮件，请勿回复<br />
                                        Please do not reply to this system email
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
}