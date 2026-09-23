ALTER TABLE "public"."couple_members" ADD COLUMN IF NOT EXISTS "country" "text";

COMMENT ON COLUMN "public"."couple_members"."country" IS 'Código de país ISO 3166-1 alfa-2 (ej. CO, JP), elegido a mano en Ajustes. Usado para sugerir fechas culturales relevantes.';
