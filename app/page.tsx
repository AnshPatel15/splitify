import { currentUser } from "@clerk/nextjs/server";
import Navbar from "../components/Navbar";
import Hero from "@/components/Hero";

export default async function Home() {
  const user = await currentUser();

  const safeUser = user ? { firstName: user.firstName } : null;

  return (
    <div>
      <Navbar user={safeUser} />
      <Hero />
    </div>
  );
}
