import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCustomizationTable1728430709318 implements MigrationInterface {
    name = 'FixCustomizationTable1728430709318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" DROP CONSTRAINT "FK_42e6ff978b4cb13d38e8db9127f"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" DROP CONSTRAINT "FK_8fd4adaf9c71fa34bca8b890ec9"`);
        await queryRunner.query(`CREATE TABLE "fatansize_test"."Customization" ("CustomizationID" SERIAL NOT NULL, "Options" jsonb NOT NULL, "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5434d8c0eb04bf5c8f14976d4a6" PRIMARY KEY ("CustomizationID"))`);
        await queryRunner.query(`CREATE TABLE "fatansize_test"."product_customizations" ("ProductCustomizationID" SERIAL NOT NULL, "Options" jsonb NOT NULL, "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10c5bcf39139ae66e4dfdd79257" PRIMARY KEY ("ProductCustomizationID"))`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" DROP COLUMN "ordersProductsOrderProductID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" DROP COLUMN "ordersPackagesOrderPackageID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "Options"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "CreatedAt"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "UpdatedAt"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "Options" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "CreatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "UpdatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "PackageID" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "PK_5434d8c0eb04bf5c8f14976d4a6"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "PK_0967f38aca3bc88c590497a0f21" PRIMARY KEY ("CustomizationID", "PackageID")`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "ProductID" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "PK_0967f38aca3bc88c590497a0f21"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ALTER COLUMN "CustomizationID" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ALTER COLUMN "CustomizationID" DROP DEFAULT`);
        await queryRunner.query(`CREATE INDEX "IDX_8d88472e00306b9aae0e3ff208" ON "fatansize_test"."Customization" ("PackageID") `);
        await queryRunner.query(`CREATE INDEX "IDX_5434d8c0eb04bf5c8f14976d4a" ON "fatansize_test"."Customization" ("CustomizationID") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d61074f56ec0a0a7c43dac211" ON "fatansize_test"."Customization" ("ProductID") `);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "FK_8d88472e00306b9aae0e3ff208a" FOREIGN KEY ("PackageID") REFERENCES "fatansize_test"."packages"("PackageID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "FK_9d61074f56ec0a0a7c43dac2112" FOREIGN KEY ("ProductID") REFERENCES "fatansize_test"."products"("ProductID") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "FK_9d61074f56ec0a0a7c43dac2112"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "FK_5434d8c0eb04bf5c8f14976d4a6"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "FK_8d88472e00306b9aae0e3ff208a"`);
        await queryRunner.query(`DROP INDEX "fatansize_test"."IDX_9d61074f56ec0a0a7c43dac211"`);
        await queryRunner.query(`DROP INDEX "fatansize_test"."IDX_5434d8c0eb04bf5c8f14976d4a"`);
        await queryRunner.query(`DROP INDEX "fatansize_test"."IDX_8d88472e00306b9aae0e3ff208"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "fatansize_test"."Customization_CustomizationID_seq" OWNED BY "fatansize_test"."Customization"."CustomizationID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ALTER COLUMN "CustomizationID" SET DEFAULT nextval('"fatansize_test"."Customization_CustomizationID_seq"')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "fatansize_test"."Customization_CustomizationID_seq" OWNED BY "fatansize_test"."Customization"."CustomizationID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ALTER COLUMN "CustomizationID" SET DEFAULT nextval('"fatansize_test"."Customization_CustomizationID_seq"')`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "PK_f93b8f05a4e2460b2375912fb6d"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "PK_68479aa111aab42fb530365acee" PRIMARY KEY ("CustomizationID", "PackageID", "ProductID")`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "PK_0967f38aca3bc88c590497a0f21"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "PK_68479aa111aab42fb530365acee" PRIMARY KEY ("CustomizationID", "PackageID", "ProductID")`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "PK_68479aa111aab42fb530365acee"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "PK_0967f38aca3bc88c590497a0f21" PRIMARY KEY ("CustomizationID", "PackageID")`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "ProductID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP CONSTRAINT "PK_0967f38aca3bc88c590497a0f21"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD CONSTRAINT "PK_5434d8c0eb04bf5c8f14976d4a6" PRIMARY KEY ("CustomizationID")`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "PackageID"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "UpdatedAt"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "CreatedAt"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" DROP COLUMN "Options"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "UpdatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "CreatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."Customization" ADD "Options" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" ADD "ordersPackagesOrderPackageID" integer`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" ADD "ordersProductsOrderProductID" integer`);
        await queryRunner.query(`DROP TABLE "fatansize_test"."product_customizations"`);
        await queryRunner.query(`DROP TABLE "fatansize_test"."Customization"`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" ADD CONSTRAINT "FK_8fd4adaf9c71fa34bca8b890ec9" FOREIGN KEY ("ordersProductsOrderProductID") REFERENCES "fatansize_test"."OrdersProducts"("OrderProductID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fatansize_test"."ordered_customization" ADD CONSTRAINT "FK_42e6ff978b4cb13d38e8db9127f" FOREIGN KEY ("ordersPackagesOrderPackageID") REFERENCES "fatansize_test"."OrdersPackages"("OrderPackageID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
