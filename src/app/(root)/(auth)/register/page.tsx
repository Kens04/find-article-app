import RegisterForm from "@/components/form/register-form";
import { Suspense } from "react";

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}