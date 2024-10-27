import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { ProductModule } from './product/product.module';

import * as redisStore from 'cache-manager-ioredis';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { AttributeModule } from './attribute/attribute.module';
import { DiscountModule } from './discount/discount.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SupplierModule } from './supplier/supplier.module';
import { NotificationModule } from './notification/notification.module';
import { CartModule } from './cart/cart.module';
import { BillModule } from './bill/bill.module';
import { PaymentModule } from './payment/payment.module';
import { VoucherModule } from './voucher/voucher.module';
import { InventoryModule } from './inventory/inventory.module';
import { ImportReceiptModule } from './import_receipt/import_receipt.module';
import { CommonModule } from './common/common.module';
import { UserInformationModule } from './user-information/user-information.module';
import { FavoriteModule } from './favorite/favorite.module';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { AccountModule } from './account/account.module';
import { SeederModule } from './seeder/seeder.module';
import { PermissionsGuard } from './auth/permisson.guard';
import { RoleModule } from './role/role.module';
import { FunctionModule } from './function/function.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 600, // seconds
      isGlobal: true,
      connectTimeout: 10000
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CloudinaryModule.forRoot(
      {
      isGlobal: true,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }
    ),


    AuthModule,
    MailModule,
    RolePermissionModule,
    ProductModule,
    AttributeModule,
    DiscountModule,
    CategoriesModule,
    ReviewsModule,
    SupplierModule,
    NotificationModule,
    CartModule,
    BillModule,
    PaymentModule,
    VoucherModule,
    InventoryModule,
    ImportReceiptModule,
    CommonModule,
    UserInformationModule,
    FavoriteModule,
    TransactionHistoryModule,
    AccountModule,
    SeederModule,
    RoleModule,
    FunctionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PermissionsGuard],
})
export class AppModule {}
