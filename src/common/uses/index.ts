import { HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { FormatResponseInterceptor } from "../interceptor/format-response.interceptor";
import { AllExceptionFilter } from "../filter/any-exception.filter";

export default (app) => {
  // 全局管道
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true },
    errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    stopAtFirstError: true,
    // 自定义处理错误方法(返回第一项报错信息)
    exceptionFactory: errors =>
      new UnprocessableEntityException(
        errors.map((e) => {
          const rule = Object.keys(e.constraints!)[0];
          return e.constraints![rule];
        })[0]
      )
  }));
  // 正常返回处理
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 异常返回处理
  app.useGlobalFilters(new AllExceptionFilter());

  // swagger配置
  const swaggerConfig = new DocumentBuilder().setTitle("vpske-service").setDescription("接口文档").setVersion("0.1").build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-doc", app, document);

  // 跨域
  app.enableCors();
}