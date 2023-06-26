-- AddForeignKey
ALTER TABLE "TestItem" ADD CONSTRAINT "TestItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
