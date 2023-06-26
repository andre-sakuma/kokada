-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "label" TEXT NOT NULL DEFAULT 'Questão ${id}';

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "label" TEXT NOT NULL DEFAULT 'Teste ${id}';
