import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req: Request) => {
  const payload = (await req.json()).record;

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    // Now we can get the session or user object

    // And we can run queries in the context of our authenticated user
    var { data, error } = await supabaseClient.from('users').select('*').eq("id", payload.user_id)
    if (error) throw error
    const user = data[0];
    var { data, error } = await supabaseClient.from('jobs').select('*').eq("id", payload.job_id)
    if (error) throw error
    const job = data[0]
    var { data, error } = await supabaseClient.from('companies').select('*').eq("id", job.company_id)
    if (error) throw error
    const company = data[0]

    const html = '<div style="margin: 5%;"><div style="color: #6DC1C5; font-family: sans-serif; font-weight: 900; font-size: 1.8em;">PRSKALNIK</div><h2 style="font-family: sans-serif; font-weight: 900; font-size: 2em;">Pozdravljen/a,<br></h2><div style="font-family: sans-serif; color: #7B7B7B; font-size: 1.2em;">uspešno si se prijavil/a na delovno mesto ' + job.title + ' pri podjetju ' + company.name + '. O nadaljnjih postopkih boš obveščen/a preko sporočila na ta elektronski naslov.</div><br><div style="font-family: sans-serif; color: #7B7B7B; font-size: 1.2em; max-width: 175px; margin-top: 25px;">Z lepimi pozdravi, ekipa Prskalnika</div></div>'


    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'prskalnik.si <noreply@prskalnik.si>',
        to: [user.email],
        subject: 'Prijava na prakso',
        html: html,
      })
    });

    var data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})