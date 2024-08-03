import Link from 'next/link';
import { sql } from 'drizzle-orm'

import { db } from '@/db';

export default async function Home() {
  const result = await db.execute(sql`SELECT current_database()`);
  console.log('result', result.rows);
  return (
    <main className="h-full flex flex-col justify-center text-center">
      <h1 className="text-5xl font-bold mb-6">
        Invoicipedia
      </h1>
      <p className="flex justify-center gap-4">
        <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-[#131316] text-white text-sm font-semibold">
          Sign In
        </Link>
      </p>
    </main>
  );
}
