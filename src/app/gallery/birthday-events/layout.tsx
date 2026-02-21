import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Birthday Event Photography Gallery - Mom and Kids',
  description: 'Beautiful birthday event photography capturing special celebrations. Professional birthday photoshoot in Pune.',
  keywords: 'birthday photography, birthday event photos, kids birthday party, Pune birthday photographer',
};

export default function BirthdayEventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
