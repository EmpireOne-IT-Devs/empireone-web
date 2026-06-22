import Button from "@/app/_components/button";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    const colors = {
        darkNavy: "#1a0b3b",
        electricBlue: "#e85c0d",
        cyan: "#00FFFF",
        deepPurple: "#5a3d9a",
        mutedPurple: "#7b52c8",
        blue: "#3b82f6",
        orange: "#e85c0d",
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center font-sans overflow-hidden relative"
            style={{
                background: `linear-gradient(135deg, ${colors.deepPurple} 0%, #0d1b4b 50%, #0a0a2e 50%, ${colors.orange} 150%)`,
            }}
        >
            <div
                // className="w-full max-w-md bg-white px-6 py-6 shadow-md rounded-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                // Changed border and rounded classes here for mobile responsiveness
                className="relative z-10 w-full max-w-md p-9 md:bg-white/5 md:backdrop-blur-2xl border-0 md:border md:border-white/50 md:rounded-[2rem] md:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)]"
            >
                <div className="flex items-center justify-center">
                    {" "}
                    <img
                        src="/images/eologo.png"
                        alt="EmpireOne Logo"
                        className=" mb-4 w-52 mt-0.5 object-contain"
                    />
                </div>
                <div className="mb-4 text-sm text-white">
                    Thanks for signing up! Before getting started, could you
                    verify your email address by clicking on the link we just
                    emailed to you? If you didn't receive the email, we will
                    gladly send you another.
                </div>

                {status === "verification-link-sent" && (
                    <div className="mb-4 text-sm font-medium text-green-600 text-center">
                        A new verification link has been sent to the email
                        address you provided during registration.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <Button
                                outlined
                                type="submit"
                                variant="warning"
                                loading={processing}
                            >
                                Send Verification Email
                            </Button>
                        </div>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="rounded-md text-sm text-white underline hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
