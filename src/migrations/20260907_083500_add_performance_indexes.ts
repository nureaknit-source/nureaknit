import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "cart_items_user_id_idx" ON "cart_items" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "downloads_user_email_idx" ON "downloads" USING btree ("user_email");
    CREATE INDEX IF NOT EXISTS "downloads_pattern_idx" ON "downloads" USING btree ("pattern_id");
    CREATE INDEX IF NOT EXISTS "orders_expires_at_idx" ON "orders" USING btree ("expires_at");
    CREATE INDEX IF NOT EXISTS "products_availability_idx" ON "products" USING btree ("availability");
    CREATE INDEX IF NOT EXISTS "patterns_featured_idx" ON "patterns" USING btree ("featured");
    CREATE INDEX IF NOT EXISTS "patterns_published_at_idx" ON "patterns" USING btree ("published_at");
    CREATE INDEX IF NOT EXISTS "blog_posts_featured_idx" ON "blog_posts" USING btree ("featured");
    CREATE INDEX IF NOT EXISTS "blog_posts_published_at_idx" ON "blog_posts" USING btree ("published_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "cart_items_user_id_idx";
    DROP INDEX IF EXISTS "downloads_user_email_idx";
    DROP INDEX IF EXISTS "orders_expires_at_idx";
    DROP INDEX IF EXISTS "products_availability_idx";
    DROP INDEX IF EXISTS "patterns_featured_idx";
    DROP INDEX IF EXISTS "patterns_published_at_idx";
    DROP INDEX IF EXISTS "blog_posts_featured_idx";
    DROP INDEX IF EXISTS "blog_posts_published_at_idx";
  `);
}
