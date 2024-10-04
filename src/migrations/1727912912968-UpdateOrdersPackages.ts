import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrdersPackages1727912912968 implements MigrationInterface {
    name = 'UpdateOrdersPackages1727912912968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP CONSTRAINT "FK_852100c7a06b52090028061b3bd"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP CONSTRAINT "FK_a974882995ffdf0b111b1f0b897"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."packages" RENAME COLUMN "message" TO "Message"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "packagePackageID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "Quantity"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "orderOrderID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "quantity" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "OrderID" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "userUserID" uuid`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "paymentMethodPaymentMethodID" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "addressAddressID" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."packages" DROP COLUMN "Message"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."packages" ADD "Message" text`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD CONSTRAINT "FK_5e4fdc811f9f6bbae78635a44a7" FOREIGN KEY ("OrderID") REFERENCES "fatansize_test"."orders"("OrderID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD CONSTRAINT "FK_385caf6d00386dca58fe45abe90" FOREIGN KEY ("userUserID") REFERENCES "fatansize_test"."users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD CONSTRAINT "FK_1a86f9f09c659e26d0ed7d16778" FOREIGN KEY ("paymentMethodPaymentMethodID") REFERENCES "fatansize_test"."payment_methods"("PaymentMethodID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD CONSTRAINT "FK_7a1123cd639fd65314a228f8c9f" FOREIGN KEY ("addressAddressID") REFERENCES "fatansize_test"."addresses"("AddressID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."OrdersPackages" ADD CONSTRAINT "FK_a7d6ee49fdf815e6f0afb620a0b" FOREIGN KEY ("OrderID") REFERENCES "fatansize_test"."orders_packages"("OrderID") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fatansize_test"."OrdersPackages" DROP CONSTRAINT "FK_a7d6ee49fdf815e6f0afb620a0b"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP CONSTRAINT "FK_7a1123cd639fd65314a228f8c9f"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP CONSTRAINT "FK_1a86f9f09c659e26d0ed7d16778"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP CONSTRAINT "FK_385caf6d00386dca58fe45abe90"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP CONSTRAINT "FK_5e4fdc811f9f6bbae78635a44a7"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."packages" DROP COLUMN "Message"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."packages" ADD "Message" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "addressAddressID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "paymentMethodPaymentMethodID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "userUserID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "OrderID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "orderOrderID" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "Quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD "packagePackageID" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."packages" RENAME COLUMN "Message" TO "message"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD CONSTRAINT "FK_a974882995ffdf0b111b1f0b897" FOREIGN KEY ("orderOrderID") REFERENCES "fatansize_test"."orders"("OrderID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."orders_packages" ADD CONSTRAINT "FK_852100c7a06b52090028061b3bd" FOREIGN KEY ("packagePackageID") REFERENCES "fatansize_test"."packages"("PackageID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
