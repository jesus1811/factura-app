import { Button, TextField, Title } from "@/components/atoms";
import { loginUser } from "@/services";
import { useTokenStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Login() {
  const { addToken } = useTokenStore();
  const [orentacion, setorentacion] = useState("");

  const { mutate: loginUserMutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data) {
        return toast("Usuario y/o contraseña incorrecta", { className: "!bg-alertError" });
      }
      addToken(data?.owner?.token);
    },
  });
  const [userForm, setUserForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");

  function handleOrientationChange() {
    if (window.orientation === 90 || window.orientation === -90) {
      setorentacion("horentacion 1");
    } else {
      //esta es la funcion que entra cuando esta en horizontal
      setorentacion("horentacion 2");
    }
  }

  const changeOrientation = (orientation: any) => {
    if (screen?.orientation?.lock) {
      screen?.orientation?.lock(orientation);
    } else if (screen?.orientation?.lock) {
      screen?.orientation?.lock(orientation);
    }
  };

  const handleOrentiacion = () => {
    if (screen?.orientation?.type.startsWith("portrait")) {
      changeOrientation("landscape-primary");
    } else {
      changeOrientation("portrait-primary");
    }
  };
  useEffect(() => {
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
  }, []);

  return (
    <section className="bg-dark-500 flex bg w-full justify-center items-center flex-col-reverse h-screen text-white">
      <article className="rounded-lg border border-gray-500 py-5 px-5 gap-5 flex flex-col text-center w-full max-w-[300px]">
        <Title>Login {orentacion}</Title>
        <Button onClick={handleOrentiacion}>Cambiar rotacion</Button>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="">Usuario</label>
          <TextField isFull value={userForm} onChange={(e) => setUserForm(e.target.value)} />
        </div>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="">Contraseña</label>
          <TextField isFull value={passwordForm} onChange={(e) => setPasswordForm(e.target.value)} type="password" />
        </div>

        <Button isFull onClick={() => loginUserMutate({ user: userForm, password: passwordForm })}>
          Ingresar
        </Button>
      </article>
    </section>
  );
}

export default Login;
