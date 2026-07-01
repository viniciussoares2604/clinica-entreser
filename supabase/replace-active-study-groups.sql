alter table public.study_groups
add column if not exists banner_image text,
add column if not exists banner_position text,
add column if not exists contact_whatsapp text,
add column if not exists installment_count integer not null default 1;

insert into public.study_groups (
  id,
  title,
  subtitle,
  status,
  audience,
  format,
  schedule,
  starts_at,
  duration,
  seats_available,
  price_in_cents,
  installment_count,
  facilitator,
  banner_image,
  banner_position,
  contact_whatsapp,
  highlights
) values
  (
    'self-da-situacao-gestalt-2026',
    'Self da Situação',
    'A teoria do self na abordagem gestáltica, com eixo temático no corpo em Gestalt-terapia.',
    'active',
    'Estudantes e profissionais interessados na abordagem gestáltica.',
    'Online pela plataforma Zoom',
    'Mensal',
    '2026-08-15',
    '5 meses',
    20,
    13000,
    5,
    'Lastênia Soares de Lima',
    '/grupo-self-situacao.jpeg',
    'center center',
    '5585996189558',
    array['Eixo temático: o corpo em Gestalt-terapia', 'Datas: 15/08, 12/09, 17/10, 14/11 e 12/12', 'Com ebooks dos encontros']
  ),
  (
    'psicopatologia-critica-gestalt-fenomenologia-2026',
    'Psicopatologia Crítica',
    'Grupo de estudo em psicopatologia crítica na abordagem gestáltica e fenomenologia.',
    'active',
    'Estudantes e profissionais interessados em Gestalt-terapia, fenomenologia e psicopatologia crítica.',
    'Online pela plataforma Meet',
    'Encontros mensais',
    '2026-08-08',
    '5 meses',
    20,
    12000,
    5,
    'Silvia Barbosa Correia e Antônio Joelmir Portela da Silva',
    '/grupo-psicopatologia-critica.jpeg',
    'center center',
    '5585981417741',
    array['Abordagem gestáltica e fenomenologia', 'Datas: 08/08, 19/09, 17/10, 21/11 e 12/12', 'Mensal']
  )
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  status = excluded.status,
  audience = excluded.audience,
  format = excluded.format,
  schedule = excluded.schedule,
  starts_at = excluded.starts_at,
  duration = excluded.duration,
  seats_available = excluded.seats_available,
  price_in_cents = excluded.price_in_cents,
  installment_count = excluded.installment_count,
  facilitator = excluded.facilitator,
  banner_image = excluded.banner_image,
  banner_position = excluded.banner_position,
  contact_whatsapp = excluded.contact_whatsapp,
  highlights = excluded.highlights,
  updated_at = now();

update public.study_groups
set status = 'closed', updated_at = now()
where id in (
  'gestalt-terapia-clinica-2026',
  'infancia-adolescencia-gestalt-2026'
);
