"use client";
import React, { useState } from "react";
import { createAuthClient } from "better-auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner"


const page = () => {

    const router = useRouter();

    const authClient = createAuthClient();
    const [isLoading, setIsLoading] = useState(false);


    const handleSignIn = async () => {
        try {
            setIsLoading(true);

            const data = await authClient.signIn.social({
                provider: "google",
            });
            toast("Sign-in successful");
            if(data?.error){

                toast("Sign-in failed");
                return;
            }

            router.replace('/dashboard');
        } catch (error) {
            toast("Sign-in failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="text-gray-600">Sign in to continue</p>



            <button
                onClick={handleSignIn}
                disabled={isLoading}
                className={`
                    flex items-center justify-center
                    px-6 py-2 rounded-lg
                    bg-orange-400 hover:bg-orange-500
                    text-white font-medium
                    transition-colors
                    ${
                        isLoading
                            ? "opacity-70 cursor-not-allowed"
                            : "cursor-pointer"
                    }
                `}
            >
                {isLoading ? "Signing in..." : "Sign in with Google"}
            </button>
        </div>
    );
};

export default page;
