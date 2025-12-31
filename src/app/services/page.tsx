import { redirect } from 'next/navigation';

export default function ServicesRedirectPage() {
  redirect('/services/web-development');
  // Optionally, return null or a loading indicator if needed,
  // but Next.js handles redirects efficiently on the server.
  return null;
}
