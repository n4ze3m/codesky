import React, { useState } from "react";
import { Eye, EyeOff, FileCode2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import agent from "../../lib/api";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      const result = await agent.login({
        identifier: identifier.includes(".")
          ? identifier
          : `${identifier}.bsky.social`,
        password: password,
      });

      if (!result.success) {
        throw new Error("Login failed");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Login successful");
      navigate({ to: "/" });
    },
    onError: (e) => {
      console.log(e);
      toast.error("Login failed");
    },
  });

  const form = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      login({
        identifier: value.identifier,
        password: value.password,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const handleGetAppPassword = () => {
    window.open("https://bsky.app/settings/app-passwords", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6 space-x-2">
          <FileCode2 className="w-8 h-8 text-[#569cd6]" />
          <h1 className="text-[#d4d4d4] text-2xl font-semibold">auth.toml</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#252526] rounded-lg border border-[#2d2d2d] overflow-hidden"
        >
          <div className="bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 py-2">
            <div className="flex items-center space-x-2">
              <FileCode2 className="w-4 h-4 text-[#569cd6]" />
              <span className="text-[#d4d4d4] text-sm">auth.toml</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-[#ce9178] font-mono">
              <div className="syntax-comment">
                # Bluesky Authentication Schema
              </div>
              <div className="text-[#ce9178]">[schema]</div>
              <div className="ml-4 text-[#ce9178]">version = "1.0.0"</div>
              <div className="ml-4 text-[#ce9178]">type = "bsky.auth"</div>

              <div className="text-[#ce9178] mt-4">[schema.credentials]</div>
              <div className="ml-4 mb-4">
                <div className="flex items-start">
                  <span className="text-[#ce9178]">identifier = </span>
                  <div className="flex-1 ml-2">
                    <div className="text-[#ce9178] mb-2">
                      type = "handle | email | did"
                    </div>
                    <form.Field
                      name="identifier"
                      children={(field) => (
                        <input
                          className="w-full bg-[#1e1e1e] text-[#ce9178] border border-[#2d2d2d] rounded px-3 py-2 focus:outline-none focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6]"
                          placeholder="handle | email | did"
                          required
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="ml-4 mb-4">
                <div className="flex items-start">
                  <span className="text-[#ce9178]">app_password = </span>
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between">
                      <div className="text-[#ce9178] mb-2">
                        type = "app-password"
                      </div>
                    </div>
                    <div className="relative">
                      <form.Field
                        name="password"
                        children={(field) => (
                          <input
                            type={showPassword ? "text" : "password"}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            className="w-full bg-[#1e1e1e] text-[#ce9178] border border-[#2d2d2d] rounded px-3 py-2 focus:outline-none focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] pr-10"
                            placeholder="xxxx-xxxx-xxxx-xxxx"
                            required
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ce9178] hover:text-[#569cd6]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleGetAppPassword}
                        className="text-[#569cd6] hover:underline text-sm"
                      >
                        Get App Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[#ce9178]">[schema.validation]</div>
              <div className="ml-4 text-[#ce9178]">
                required = ["identifier", "app_password"]
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full bg-[#569cd6] text-white rounded px-4 py-2 hover:bg-[#4e8cc2] focus:outline-none focus:ring-2 focus:ring-[#569cd6] focus:ring-opacity-50 transition-colors ${
                  isLoggingIn ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono">
                    {isLoggingIn ? "bsky.validate()" : "bsky.authenticate()"}
                  </span>
                  {isLoggingIn && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 text-center">
          <div className="syntax-comment"># New to Bluesky?</div>
          <button
            onClick={() => window.open("https://bsky.app", "_blank")}
            className="text-[#569cd6] hover:underline mt-1 font-mono"
          >
            bsky.register()
          </button>
        </div>
      </div>
    </div>
  );
}
