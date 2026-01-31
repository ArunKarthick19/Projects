"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Hello World</h1>
    </div>
  );
}
