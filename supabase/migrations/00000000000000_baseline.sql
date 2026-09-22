


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."couple_members_limit"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
  n int;
begin
  select count(*) into n from public.couple_members where couple_id = new.couple_id;
  if n >= 2 then
    raise exception 'Esta pareja ya tiene dos integrantes' using errcode = 'P0001';
  end if;
  return new;
end $$;


ALTER FUNCTION "public"."couple_members_limit"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."couples" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "start_date" "date",
    "invite_code" "text" NOT NULL,
    "locale" "text" DEFAULT 'es'::"text" NOT NULL,
    "plan" "text" DEFAULT 'free'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "couples_plan_check" CHECK (("plan" = ANY (ARRAY['free'::"text", 'premium'::"text"])))
);


ALTER TABLE "public"."couples" OWNER TO "postgres";


COMMENT ON TABLE "public"."couples" IS 'Espacio compartido de una pareja. Todo el contenido (recuerdos, fechas, momentos) cuelga de couple_id.';



COMMENT ON COLUMN "public"."couples"."invite_code" IS 'Código único que la segunda persona canjea para unirse. Se regenera si se filtra.';



CREATE OR REPLACE FUNCTION "public"."create_couple"("p_start_date" "date" DEFAULT NULL::"date", "p_locale" "text" DEFAULT 'es'::"text") RETURNS "public"."couples"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_couple public.couples;
  v_code text;
  v_tries int := 0;
begin
  if auth.uid() is null then
    raise exception 'Se requiere sesión iniciada' using errcode = '28000';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'Ya perteneces a una pareja' using errcode = 'P0001';
  end if;

  loop
    v_code := public.generate_invite_code();
    v_tries := v_tries + 1;
    exit when not exists (select 1 from public.couples where invite_code = v_code) or v_tries > 10;
  end loop;

  insert into public.couples (start_date, invite_code, locale)
  values (p_start_date, v_code, coalesce(p_locale, 'es'))
  returning * into v_couple;

  insert into public.couple_members (couple_id, user_id)
  values (v_couple.id, auth.uid());

  return v_couple;
end $$;


ALTER FUNCTION "public"."create_couple"("p_start_date" "date", "p_locale" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_couple"("p_start_date" "date", "p_locale" "text") IS 'Crea una pareja nueva con el usuario actual como primer miembro y devuelve la fila creada (incluye invite_code).';



CREATE OR REPLACE FUNCTION "public"."generate_invite_code"() RETURNS "text"
    LANGUAGE "sql"
    AS $$
  -- 8 caracteres en base32 (sin 0/O/1/I para evitar confusión al dictarlo)
  select string_agg(
    substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', (ceil(random()*32))::int, 1), ''
  ) from generate_series(1,8)
$$;


ALTER FUNCTION "public"."generate_invite_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_couple_member"("p_couple_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.couple_members
    where couple_id = p_couple_id and user_id = auth.uid()
  )
$$;


ALTER FUNCTION "public"."is_couple_member"("p_couple_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_couple_member"("p_couple_id" "uuid") IS 'True si el usuario autenticado actual pertenece a la pareja p_couple_id. Usada por todas las políticas RLS.';



CREATE OR REPLACE FUNCTION "public"."join_couple"("p_invite_code" "text") RETURNS "public"."couples"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_couple public.couples;
  v_count int;
begin
  if auth.uid() is null then
    raise exception 'Se requiere sesión iniciada' using errcode = '28000';
  end if;

  if exists (select 1 from public.couple_members where user_id = auth.uid()) then
    raise exception 'Ya perteneces a una pareja' using errcode = 'P0001';
  end if;

  select * into v_couple from public.couples
    where invite_code = upper(trim(p_invite_code));

  if v_couple.id is null then
    raise exception 'Código de invitación inválido' using errcode = 'P0002';
  end if;

  select count(*) into v_count from public.couple_members where couple_id = v_couple.id;
  if v_count >= 2 then
    raise exception 'Esta pareja ya tiene dos integrantes' using errcode = 'P0001';
  end if;

  insert into public.couple_members (couple_id, user_id)
  values (v_couple.id, auth.uid());

  return v_couple;
end $$;


ALTER FUNCTION "public"."join_couple"("p_invite_code" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."join_couple"("p_invite_code" "text") IS 'Une al usuario actual a la pareja dueña de p_invite_code, si todavía tiene un cupo libre.';



CREATE OR REPLACE FUNCTION "public"."leave_couple"("p_couple_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  delete from public.couple_members
    where couple_id = p_couple_id and user_id = auth.uid();
  -- Si no queda ningún miembro, se borra la pareja y en cascada su contenido.
  if not exists (select 1 from public.couple_members where couple_id = p_couple_id) then
    delete from public.couples where id = p_couple_id;
  end if;
end $$;


ALTER FUNCTION "public"."leave_couple"("p_couple_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."leave_couple"("p_couple_id" "uuid") IS 'El usuario actual sale de la pareja. Si era el último miembro, borra la pareja y todo su contenido en cascada.';



CREATE OR REPLACE FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_code text;
begin
  if not public.is_couple_member(p_couple_id) then
    raise exception 'No perteneces a esta pareja' using errcode = '42501';
  end if;
  loop
    v_code := public.generate_invite_code();
    exit when not exists (select 1 from public.couples where invite_code = v_code);
  end loop;
  update public.couples set invite_code = v_code where id = p_couple_id;
  return v_code;
end $$;


ALTER FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") IS 'Genera un código de invitación nuevo si el actual se filtró. Solo lo puede llamar un miembro de la pareja.';



CREATE OR REPLACE FUNCTION "public"."storage_couple_id"("p_path" "text") RETURNS "uuid"
    LANGUAGE "sql" IMMUTABLE
    AS $$
  select nullif(split_part(p_path, '/', 1), '')::uuid
$$;


ALTER FUNCTION "public"."storage_couple_id"("p_path" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end $$;


ALTER FUNCTION "public"."touch_updated_at"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."couple_dates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "couple_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "title" "text" NOT NULL,
    "happens_on" "date" NOT NULL,
    "kind" "text" DEFAULT 'otro'::"text" NOT NULL,
    "repeat" "text" DEFAULT 'none'::"text" NOT NULL,
    "place" "text",
    "note" "text",
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "couple_dates_kind_check" CHECK (("kind" = ANY (ARRAY['encuentro'::"text", 'aniversario'::"text", 'cumple'::"text", 'especial'::"text", 'otro'::"text"]))),
    CONSTRAINT "couple_dates_note_check" CHECK (("char_length"("note") <= 500)),
    CONSTRAINT "couple_dates_repeat_check" CHECK (("repeat" = ANY (ARRAY['none'::"text", 'monthly'::"text", 'yearly'::"text"]))),
    CONSTRAINT "couple_dates_title_check" CHECK ((("char_length"("title") >= 1) AND ("char_length"("title") <= 120)))
);


ALTER TABLE "public"."couple_dates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."couple_members" (
    "couple_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "display_name" "text",
    "city" "text",
    "lat" double precision,
    "lon" double precision,
    "tz" "text",
    "locale" "text",
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."couple_members" OWNER TO "postgres";


COMMENT ON TABLE "public"."couple_members" IS 'Relación usuario<->pareja. Como mucho 2 miembros por pareja (trigger couple_members_limit).';



CREATE TABLE IF NOT EXISTS "public"."memories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "couple_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "title" "text" NOT NULL,
    "happened_on" "date" NOT NULL,
    "tag" "text" DEFAULT 'otro'::"text" NOT NULL,
    "place" "text",
    "body" "text",
    "is_favorite" boolean DEFAULT false NOT NULL,
    "photo_path" "text",
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "memories_body_check" CHECK (("char_length"("body") <= 3000)),
    CONSTRAINT "memories_tag_check" CHECK (("tag" = ANY (ARRAY['cita'::"text", 'viaje'::"text", 'detalle'::"text", 'charla'::"text", 'logro'::"text", 'otro'::"text"]))),
    CONSTRAINT "memories_title_check" CHECK ((("char_length"("title") >= 1) AND ("char_length"("title") <= 120)))
);


ALTER TABLE "public"."memories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."moments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "couple_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "name" "text" NOT NULL,
    "happens_on" "date",
    "repeat" "text" DEFAULT 'none'::"text" NOT NULL,
    "tagline" "text",
    "message" "text",
    "motif" "text" DEFAULT 'destellos'::"text" NOT NULL,
    "emoji" "text" DEFAULT '💛'::"text" NOT NULL,
    "font" "text" DEFAULT 'serif'::"text" NOT NULL,
    "density" integer DEFAULT 30 NOT NULL,
    "speed" numeric DEFAULT 2 NOT NULL,
    "palette" "jsonb" DEFAULT '{"bg1": "#2A2052", "bg2": "#5B3FA8", "ink": "#F7F2FF", "accent": "#F6B800"}'::"jsonb" NOT NULL,
    "photo_path" "text",
    "plan" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "moments_density_check" CHECK ((("density" >= 8) AND ("density" <= 120))),
    CONSTRAINT "moments_font_check" CHECK (("font" = ANY (ARRAY['serif'::"text", 'hand'::"text", 'sans'::"text"]))),
    CONSTRAINT "moments_message_check" CHECK (("char_length"("message") <= 1000)),
    CONSTRAINT "moments_name_check" CHECK ((("char_length"("name") >= 1) AND ("char_length"("name") <= 80))),
    CONSTRAINT "moments_repeat_check" CHECK (("repeat" = ANY (ARRAY['none'::"text", 'yearly'::"text"]))),
    CONSTRAINT "moments_speed_check" CHECK ((("speed" >= (1)::numeric) AND ("speed" <= (5)::numeric))),
    CONSTRAINT "moments_tagline_check" CHECK (("char_length"("tagline") <= 140))
);


ALTER TABLE "public"."moments" OWNER TO "postgres";


ALTER TABLE ONLY "public"."couple_dates"
    ADD CONSTRAINT "couple_dates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."couple_members"
    ADD CONSTRAINT "couple_members_pkey" PRIMARY KEY ("couple_id", "user_id");



ALTER TABLE ONLY "public"."couples"
    ADD CONSTRAINT "couples_invite_code_key" UNIQUE ("invite_code");



ALTER TABLE ONLY "public"."couples"
    ADD CONSTRAINT "couples_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memories"
    ADD CONSTRAINT "memories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moments"
    ADD CONSTRAINT "moments_pkey" PRIMARY KEY ("id");



CREATE INDEX "couple_members_user_idx" ON "public"."couple_members" USING "btree" ("user_id");



CREATE INDEX "dates_couple_idx" ON "public"."couple_dates" USING "btree" ("couple_id", "happens_on");



CREATE INDEX "dates_sync_idx" ON "public"."couple_dates" USING "btree" ("couple_id", "updated_at");



CREATE INDEX "memories_couple_idx" ON "public"."memories" USING "btree" ("couple_id", "happened_on" DESC);



CREATE INDEX "memories_sync_idx" ON "public"."memories" USING "btree" ("couple_id", "updated_at");



CREATE INDEX "moments_couple_idx" ON "public"."moments" USING "btree" ("couple_id");



CREATE INDEX "moments_sync_idx" ON "public"."moments" USING "btree" ("couple_id", "updated_at");



CREATE OR REPLACE TRIGGER "couple_members_limit_trg" BEFORE INSERT ON "public"."couple_members" FOR EACH ROW EXECUTE FUNCTION "public"."couple_members_limit"();



CREATE OR REPLACE TRIGGER "couples_touch" BEFORE UPDATE ON "public"."couples" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "dates_touch" BEFORE UPDATE ON "public"."couple_dates" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "memories_touch" BEFORE UPDATE ON "public"."memories" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "moments_touch" BEFORE UPDATE ON "public"."moments" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



ALTER TABLE ONLY "public"."couple_dates"
    ADD CONSTRAINT "couple_dates_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."couple_dates"
    ADD CONSTRAINT "couple_dates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."couple_members"
    ADD CONSTRAINT "couple_members_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."couple_members"
    ADD CONSTRAINT "couple_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."memories"
    ADD CONSTRAINT "memories_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."memories"
    ADD CONSTRAINT "memories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."moments"
    ADD CONSTRAINT "moments_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moments"
    ADD CONSTRAINT "moments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE "public"."couple_dates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."couple_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "couple_members_delete_self" ON "public"."couple_members" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "couple_members_select" ON "public"."couple_members" FOR SELECT TO "authenticated" USING ("public"."is_couple_member"("couple_id"));



CREATE POLICY "couple_members_update_self" ON "public"."couple_members" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."couples" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "couples_delete" ON "public"."couples" FOR DELETE TO "authenticated" USING ("public"."is_couple_member"("id"));



CREATE POLICY "couples_insert" ON "public"."couples" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "couples_select" ON "public"."couples" FOR SELECT TO "authenticated" USING ("public"."is_couple_member"("id"));



CREATE POLICY "couples_update" ON "public"."couples" FOR UPDATE TO "authenticated" USING ("public"."is_couple_member"("id")) WITH CHECK ("public"."is_couple_member"("id"));



CREATE POLICY "dates_rw" ON "public"."couple_dates" TO "authenticated" USING ("public"."is_couple_member"("couple_id")) WITH CHECK ("public"."is_couple_member"("couple_id"));



ALTER TABLE "public"."memories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "memories_rw" ON "public"."memories" TO "authenticated" USING ("public"."is_couple_member"("couple_id")) WITH CHECK ("public"."is_couple_member"("couple_id"));



ALTER TABLE "public"."moments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "moments_rw" ON "public"."moments" TO "authenticated" USING ("public"."is_couple_member"("couple_id")) WITH CHECK ("public"."is_couple_member"("couple_id"));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."couple_members_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."couple_members_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."couple_members_limit"() TO "service_role";



GRANT ALL ON TABLE "public"."couples" TO "anon";
GRANT ALL ON TABLE "public"."couples" TO "authenticated";
GRANT ALL ON TABLE "public"."couples" TO "service_role";



REVOKE ALL ON FUNCTION "public"."create_couple"("p_start_date" "date", "p_locale" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."create_couple"("p_start_date" "date", "p_locale" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_couple"("p_start_date" "date", "p_locale" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_couple"("p_start_date" "date", "p_locale" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_invite_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_invite_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_invite_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_couple_member"("p_couple_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_couple_member"("p_couple_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_couple_member"("p_couple_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."join_couple"("p_invite_code" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."join_couple"("p_invite_code" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."join_couple"("p_invite_code" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_couple"("p_invite_code" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."leave_couple"("p_couple_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."leave_couple"("p_couple_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."leave_couple"("p_couple_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."leave_couple"("p_couple_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regenerate_invite_code"("p_couple_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."storage_couple_id"("p_path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."storage_couple_id"("p_path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."storage_couple_id"("p_path" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."couple_dates" TO "anon";
GRANT ALL ON TABLE "public"."couple_dates" TO "authenticated";
GRANT ALL ON TABLE "public"."couple_dates" TO "service_role";



GRANT ALL ON TABLE "public"."couple_members" TO "anon";
GRANT ALL ON TABLE "public"."couple_members" TO "authenticated";
GRANT ALL ON TABLE "public"."couple_members" TO "service_role";



GRANT ALL ON TABLE "public"."memories" TO "anon";
GRANT ALL ON TABLE "public"."memories" TO "authenticated";
GRANT ALL ON TABLE "public"."memories" TO "service_role";



GRANT ALL ON TABLE "public"."moments" TO "anon";
GRANT ALL ON TABLE "public"."moments" TO "authenticated";
GRANT ALL ON TABLE "public"."moments" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







