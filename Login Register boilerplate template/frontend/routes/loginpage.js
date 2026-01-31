"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
//use cors
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
}); 



export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:5000/api/users/register"
      : "http://localhost:5000/api/users/login";

    const bodyData = isRegister
      ? form
      : { email: form.email, password: form.password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // ✅ Save token
    localStorage.setItem("token", data.token);

    // ✅ Go to homepage
    router.push("/home");
  };

  return (
    <div style={styles.container}>
      <h2>{isRegister ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {isRegister && (
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p onClick={() => setIsRegister(!isRegister)} style={styles.link}>
        {isRegister
          ? "Already have an account? Login"
          : "No account? Register"}
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "100px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  link: { color: "blue", cursor: "pointer", marginTop: 10 },
};

