/*
  Warnings:

  - You are about to drop the column `proficiency` on the `employee_skills` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."employee_skills" DROP COLUMN "proficiency";

-- DropEnum
DROP TYPE "public"."proficiency_level";
