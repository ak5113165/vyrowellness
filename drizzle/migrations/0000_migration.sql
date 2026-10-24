-- Enquiry/lead capture for VYRO (Phase 1)
-- Inserted only from server code (service role); RLS blocks all client access.
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'consumer' CHECK (kind IN ('consumer', 'business')),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  city text,
  product_interest text,
  home_or_business text,
  budget text,
  message text,
  business_name text,
  business_type text,
  products_of_interest text,
  project_description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- No policies: the table is not readable or writable through the client API.
-- Inserts happen only inside the server route using the server-side credentials.