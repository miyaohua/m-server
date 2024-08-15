import { ValueTransformer } from "typeorm";
import * as moment from "moment";

// 日期转换器
export class DateTransformer implements ValueTransformer {
  // 写入
  to(value: any): any {
    return value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : moment().toDate();
  }

  // 读取
  from(value: any): any {
    return value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null;
  }
}
