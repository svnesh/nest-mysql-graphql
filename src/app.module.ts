import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CustomerModule } from './customer/customer.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'invoiceapp',
      entities: ['dist/**/*.model{.ts,.js}'],
      synchronize: true,
    }),
    CustomerModule,
    InvoiceModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
