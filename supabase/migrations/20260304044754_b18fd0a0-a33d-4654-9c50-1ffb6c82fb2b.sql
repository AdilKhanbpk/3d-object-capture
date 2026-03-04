-- Create models table
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Models are viewable by everyone" ON public.models FOR SELECT USING (true);
CREATE POLICY "Anyone can upload models" ON public.models FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete models" ON public.models FOR DELETE USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true);

CREATE POLICY "Model files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'models');
CREATE POLICY "Anyone can upload model files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'models');
CREATE POLICY "Anyone can delete model files" ON storage.objects FOR DELETE USING (bucket_id = 'models');

INSERT INTO storage.buckets (id, name, public) VALUES ('captures', 'captures', true);

CREATE POLICY "Captures are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'captures');
CREATE POLICY "Anyone can upload captures" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'captures');
CREATE POLICY "Anyone can delete captures" ON storage.objects FOR DELETE USING (bucket_id = 'captures');