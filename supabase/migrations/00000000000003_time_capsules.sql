CREATE TABLE IF NOT EXISTS "public"."time_capsules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "couple_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "open_on" "date" NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "time_capsules_body_check" CHECK (("char_length"("body") <= 3000)),
    CONSTRAINT "time_capsules_title_check" CHECK ((("char_length"("title") >= 1) AND ("char_length"("title") <= 120)))
);

ALTER TABLE "public"."time_capsules" OWNER TO "postgres";

COMMENT ON TABLE "public"."time_capsules" IS 'Mensajes escritos ahora que se revelan en open_on. La UI oculta el cuerpo hasta esa fecha para quien no sea el autor; el aislamiento real (RLS) sigue siendo por pareja, igual que el resto de las tablas.';

ALTER TABLE ONLY "public"."time_capsules"
    ADD CONSTRAINT "time_capsules_pkey" PRIMARY KEY ("id");

CREATE INDEX "time_capsules_couple_idx" ON "public"."time_capsules" USING "btree" ("couple_id", "open_on");

CREATE OR REPLACE TRIGGER "time_capsules_touch" BEFORE UPDATE ON "public"."time_capsules" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();

ALTER TABLE ONLY "public"."time_capsules"
    ADD CONSTRAINT "time_capsules_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."time_capsules"
    ADD CONSTRAINT "time_capsules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;

ALTER TABLE "public"."time_capsules" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "time_capsules_rw" ON "public"."time_capsules" TO "authenticated" USING ("public"."is_couple_member"("couple_id")) WITH CHECK ("public"."is_couple_member"("couple_id"));

GRANT ALL ON TABLE "public"."time_capsules" TO "anon";
GRANT ALL ON TABLE "public"."time_capsules" TO "authenticated";
GRANT ALL ON TABLE "public"."time_capsules" TO "service_role";
