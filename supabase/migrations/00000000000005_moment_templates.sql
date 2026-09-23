CREATE TABLE IF NOT EXISTS "public"."moment_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "couple_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "title" "text" NOT NULL,
    "tagline" "text",
    "message" "text",
    "motif" "text" DEFAULT 'destellos'::"text" NOT NULL,
    "emoji" "text" DEFAULT '💛'::"text" NOT NULL,
    "font" "text" DEFAULT 'serif'::"text" NOT NULL,
    "density" integer DEFAULT 30 NOT NULL,
    "speed" numeric DEFAULT 2 NOT NULL,
    "palette" "jsonb" NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "moment_templates_message_check" CHECK (("char_length"("message") <= 500)),
    CONSTRAINT "moment_templates_tagline_check" CHECK (("char_length"("tagline") <= 160)),
    CONSTRAINT "moment_templates_title_check" CHECK (("char_length"("title") >= 1) AND ("char_length"("title") <= 120))
);

ALTER TABLE "public"."moment_templates" OWNER TO "postgres";

COMMENT ON TABLE "public"."moment_templates" IS 'Plantillas de diseño de Momento publicadas por una pareja para que otras las usen como punto de partida. A diferencia del resto de tablas, el SELECT es público entre todas las parejas (moment_templates_select): es la única tabla de este esquema pensada para leerse entre parejas distintas. No incluye foto, plan ni fecha (happens_on): eso queda siempre a criterio de quien la usa. INSERT/UPDATE/DELETE siguen restringidos a la pareja dueña.';

ALTER TABLE ONLY "public"."moment_templates"
    ADD CONSTRAINT "moment_templates_pkey" PRIMARY KEY ("id");

CREATE INDEX "moment_templates_created_idx" ON "public"."moment_templates" USING "btree" ("created_at" DESC);

CREATE OR REPLACE TRIGGER "moment_templates_touch" BEFORE UPDATE ON "public"."moment_templates" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();

ALTER TABLE ONLY "public"."moment_templates"
    ADD CONSTRAINT "moment_templates_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."moment_templates"
    ADD CONSTRAINT "moment_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;

ALTER TABLE "public"."moment_templates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moment_templates_select" ON "public"."moment_templates" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "moment_templates_insert" ON "public"."moment_templates" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_couple_member"("couple_id"));

CREATE POLICY "moment_templates_update" ON "public"."moment_templates" FOR UPDATE TO "authenticated" USING ("public"."is_couple_member"("couple_id")) WITH CHECK ("public"."is_couple_member"("couple_id"));

CREATE POLICY "moment_templates_delete" ON "public"."moment_templates" FOR DELETE TO "authenticated" USING ("public"."is_couple_member"("couple_id"));

GRANT ALL ON TABLE "public"."moment_templates" TO "anon";
GRANT ALL ON TABLE "public"."moment_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."moment_templates" TO "service_role";
