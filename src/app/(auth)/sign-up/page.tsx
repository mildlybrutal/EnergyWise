"use client";
import React, { useState } from "react";
import { createAuthClient } from "better-auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUpPage = () => {
    const router = useRouter();
    const authClient = createAuthClient();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            const data = await authClient.signIn.social({
                provider: "google",
            });

            if (data?.error) {
                toast.error("Sign-up failed: " + data.error);
                return;
            }

            toast.success("Sign-up successful");
            router.replace("/dashboard");
        } catch (error) {
            toast.error("Failed to sign up with Google");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !name) {
            toast.error("Please enter all fields");
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (error) {
                toast.error("Sign-up failed: " + error);
                return;
            }

            toast.success("Sign-up successful");
            router.replace("/dashboard");
        } catch (error) {
            toast.error("Failed to sign up with email");
        } finally {
            setIsLoading(false);
            setPassword("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <p className="text-gray-600">Create your account</p>

            <form onSubmit={handleEmailSignUp} className="w-full max-w-sm space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={2}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={6}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing up..." : "Sign up with Email"}
                </button>
            </form>

            <div className="flex items-center w-full max-w-sm my-4">
                <div className="border-t flex-1"></div>
                <span className="px-4 text-gray-500">or</span>
                <div className="border-t flex-1"></div>
            </div>

            <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="flex items-center justify-center w-full max-w-sm px-6 py-2 rounded-lg bg-orange-400 hover:bg-orange-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Signing up..." : "Sign up with Google"}
            </button>
        </div>
    );
};

export default SignUpPage;