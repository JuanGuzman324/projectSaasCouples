CREATE TABLE IF NOT EXISTS "public"."push_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "couple_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "endpoint" "text" NOT NULL,
    "p256dh" "text" NOT NULL,
    "auth" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE ("endpoint")
);

ALTER TABLE "public"."push_subscriptions" OWNER TO "postgres";

COMMENT ON TABLE "public"."push_subscriptions" IS 'Suscripciones Web Push (BACKLOG P3). Una fila por navegador/dispositivo suscrito; endpoint es único porque el propio navegador ya garantiza que identifica a ese dispositivo. La Edge Function send-reminders las lee con la service_role key (bypassa RLS), no con el cliente.';

ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id");

CREATE INDEX "push_subscriptions_couple_idx" ON "public"."push_subscriptions" USING "btree" ("couple_id");

ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE "public"."push_subscriptions" ENABLE ROW LEVEL SECURITY;

-- Mismo criterio que el resto del esquema: cualquier integrante de la
-- pareja puede administrar las suscripciones de la pareja (no solo las
-- propias), consistente con que la pareja ya comparte todo lo demás.
CREATE POLICY "push_subscriptions_rw" ON "public"."push_subscriptions" TO "authenticated" USING ("public"."is_couple_member"("couple_id")) WITH CHECK ("public"."is_couple_member"("couple_id") AND "user_id" = "auth"."uid"());

GRANT ALL ON TABLE "public"."push_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."push_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."push_subscriptions" TO "service_role";
