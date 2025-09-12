/*
  Warnings:

  - You are about to drop the column `availability` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `system_role` on the `users` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."employees" DROP COLUMN "availability";

-- AlterTable - Add owner_id column as nullable first
ALTER TABLE "public"."projects" ADD COLUMN "owner_id" INTEGER;

-- Update existing projects to set owner_id = created_by
UPDATE "public"."projects" SET "owner_id" = "created_by";

-- Now make owner_id NOT NULL
ALTER TABLE "public"."projects" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "system_role";

-- DropEnum
DROP TYPE "public"."availability_status";

-- DropEnum
DROP TYPE "public"."system_role";

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
