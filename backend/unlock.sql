-- Opciones para desbloquear la prueba si tira error de "relation does not exist"

-- Opción 1: Especificar el esquema public explícitamente y usar comillas
UPDATE public."visa_tests"
SET status = 'paid'
WHERE id IN (
  SELECT id 
  FROM public."visa_tests" 
  WHERE status = 'locked' 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Opción 2: Si por casualidad la tabla se llama en singular en tu base de datos "visa_test"
-- UPDATE public."visa_test"
-- SET status = 'paid'
-- WHERE id IN (
--   SELECT id 
--   FROM public."visa_test" 
--   WHERE status = 'locked' 
--   ORDER BY created_at DESC 
--   LIMIT 1
-- );
