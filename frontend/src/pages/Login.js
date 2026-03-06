import api from "../api";

export default function Login() {
  const login = async () => {
    await api.post("/auth/login", {
      email: "test@test.com",
      password: "123456"
    });
  };

  return <button onClick={login}>Login</button>;
}