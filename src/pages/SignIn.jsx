import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import GradientButton from "../components/GradientButton";

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-orange-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <div className="rounded-3xl bg-card p-7 shadow-xl">
          <Logo />
          <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
            Sign in to your <span className="brand-text">AI Twin</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Continue with Google to access your dashboard, products and live sessions.
          </p>
          <GradientButton
            className="mt-7"
            onClick={() => navigate("/app/wizard")}
            icon={
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-sm font-black">
                G
              </span>
            }
          >
            Continue with Google
          </GradientButton>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our terms.
            <br />
            Your AI Twin awaits.
          </p>
        </div>
        <Link
          to="/"
          className="mt-4 text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
