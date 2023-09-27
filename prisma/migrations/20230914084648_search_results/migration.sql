-- CreateEnum
CREATE TYPE "SearchEngine" AS ENUM ('google', 'bing');

-- CreateTable
CREATE TABLE "search_results" (
    "id" UUID NOT NULL,
    "keyword" VARCHAR(100) NOT NULL,
    "html" TEXT,
    "status" SMALLINT,
    "ad_words_top_count" INTEGER,
    "total_links_count" INTEGER,
    "non_ad_links_count" INTEGER,
    "ad_words_count" INTEGER,
    "ad_word_top_urls" TEXT[],
    "nod_ad_urls" TEXT[],
    "search_engine" "SearchEngine",
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "search_results" ADD CONSTRAINT "search_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
