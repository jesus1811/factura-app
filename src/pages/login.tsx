import { Button, TextField } from "@/components/atoms";
import { loginUser } from "@/services";
import { useTokenStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function Login() {
  const { addToken } = useTokenStore();

  const { mutate: loginUserMutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data) return;
      addToken(data?.owner?.token);
    },
  });
  const [userForm, setUserForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");

  return (
    <div>
      <TextField value={userForm} onChange={(e) => setUserForm(e.target.value)} placeholder="usuario" />
      <TextField value={passwordForm} onChange={(e) => setPasswordForm(e.target.value)} placeholder="contraseña" />
      <Button onClick={() => loginUserMutate({ user: userForm, password: passwordForm })}>Ingresar</Button>
    </div>
  );
}

export default Login;
