"use client"

import Title from "@/components/customs/title"
import LoginForm from "@/components/forms/Login"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <Title useAnimate={true} />
            <Card className="w-[400px]">
                <CardContent className="p-4">
                    <h1 className="text-3xl mb-4">Sign In</h1>
                    <div className="text-slate-300 text-sm mb-6">Enter your username and password to Sign-in.</div>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}