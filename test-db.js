const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://qbxngfsbnwgllkinpcyt.supabase.co',
  'sb_publishable_QJgFEJNuxZ0YU_nDgWEB1Q_lzqjEF7R'
)

async function test() {
  const { data: towns } = await supabase.from('towns').select('name, total_applications, total_approved').limit(10)
  console.log('Towns data:')
  towns?.forEach(t => console.log(`  ${t.name}: ${t.total_applications} apps, ${t.total_approved} approved`))
}

test()
