-- Allow public (anonymous) users to insert into leads table
CREATE POLICY "Public users can insert leads"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);
