import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "@/app/_components/input";
import Button from "@/app/_components/button";

export default function ChangePasswordSection() {
    const [form, setForm] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [error, setError] = useState("");

    const toggle = (field) => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.new.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        if (form.new !== form.confirm) {
            return setError("Passwords do not match.");
        }

        setError("");
        console.log("Submit:", form);
    };

    return (
        <div className="max-w-lg w-full mx-auto bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                    <Lock className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Change Password
                    </h2>
                    <p className="text-sm text-gray-500">
                        Make sure your password is strong and secure
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Current Password"
                    name="current"
                    type={show.current ? "text" : "password"}
                    value={form.current}
                    onChange={handleChange}
                    required
                    iconRight={
                        <button type="button" onClick={() => toggle("current")}>
                            {show.current ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    }
                />

                <Input
                    label="New Password"
                    name="new"
                    type={show.new ? "text" : "password"}
                    value={form.new}
                    onChange={handleChange}
                    required
                    iconRight={
                        <button type="button" onClick={() => toggle("new")}>
                            {show.new ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    }
                />

                <Input
                    label="Confirm Password"
                    name="confirm"
                    type={show.confirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    required
                    iconRight={
                        <button type="button" onClick={() => toggle("confirm")}>
                            {show.confirm ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    }
                />

                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2 text-xs">
                        Create a Strong Password
                    </h3>

                    <ul className="list-disc list-inside text-blue-700 text-xs space-y-1">
                        <li>Minimum of 8 characters</li>
                        <li>At least 1 uppercase letter (A–Z)</li>
                        <li>At least 1 lowercase letter (a–z)</li>
                        <li>At least 1 number (0–9)</li>
                        <li>At least 1 special character (! @ # $ % * ? &)</li>
                    </ul>

                    <p className="mt-2 text-blue-800 text-xs">
                        Example: <strong>Secure@123</strong>
                    </p>

                    <p className="mt-2 text-blue-600 text-[11px]">
                        Avoid using common words, names, or birthdays for better
                        security.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="secondary" type="button">
                        Cancel
                    </Button>
                    <Button type="submit">Update Password</Button>
                </div>
            </form>
        </div>
    );
}
