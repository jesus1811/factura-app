import { Button, TextField, Title } from "@/components/atoms";
import { loginUser } from "@/services";
import { useTokenStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function Login() {
  const { addToken } = useTokenStore();

  const { mutate: loginUserMutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data) {
        return toast("Usuario y/o contraseña incorrecta", { className: "!bg-alertError" });
      }
      addToken(data?.owner?.token);
    },
  });
  const [userForm, setUserForm] = useState("jesus1811");
  const [passwordForm, setPasswordForm] = useState("1153259");
  return (
    <section className="bg-dark-500 flex bg w-full justify-center items-center flex-col h-screen text-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!userForm || !passwordForm) return;
          loginUserMutate({ user: userForm, password: passwordForm });
        }}
        className="rounded-lg border border-gray-500 py-5 px-5 gap-5 flex flex-col text-center w-full max-w-[300px]"
      >
        <Title>Login</Title>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="">Usuario</label>
          <TextField error={!passwordForm ? "Falta agregar usuario" : undefined} isFull value={userForm} onChange={(e) => setUserForm(e.target.value)} />
        </div>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="">Contraseña</label>
          <TextField error={!passwordForm ? "Falta agregar contraseña" : undefined} isFull value={passwordForm} onChange={(e) => setPasswordForm(e.target.value)} type="password" />
        </div>
        <Button isDisabled={isPending} isFull>
          Ingresar
        </Button>
      </form>
    </section>
  );
}

export default Login;
