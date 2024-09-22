"use client"

import * as yup from 'yup'
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { useForm } from '@tanstack/react-form'
import { yupValidator as validatorAdapter } from "@tanstack/yup-form-adapter"
import { FaExclamation } from 'react-icons/fa';
import { Button } from "../ui/button"
import InputUI from "../customs/forms/input"
import { Label } from "../ui/label"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { signIn } from 'next-auth/react'
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify'

function FieldInfo({ field }) {
    return (
        <>
            {field.state.meta.touchedErrors ? (
                <p className="text-sm text-destructive mt-1">{field.state.meta.touchedErrors}</p>
            ) : null}
            {field.state.meta.isValidating ? (
                <p className="text-sm text-muted-foreground">Validating...</p>
            ) : null}
        </>
    )
}

export default function LoginForm() {
    const [token, setToken] = useState(null)
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const [enablePassword, setEnablePassword] = useState(false),
    [isSuccess, setSuccess] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = useMemo(() => searchParams.get('callbackUrl'), [])

    const onRecaptchaVerify = useCallback(token => setToken(token))
    
    const form = useForm({
        validatorAdapter,
        defaultValues: {
            username: '',
            password: ''
        },
        async onSubmit({ value }) {
            const response = await signIn('credentials', {
                username: value.username,
                password: value.password,
                redirect: false
            })

            if (response?.error) {
                toast.warn(response?.error, {
                    position: 'top-center',
                    icon: <FaExclamation color="red" />
                })
            }

            if (response?.status === 200 && !response?.error) {
                setSuccess(true)
                toast.success('Successfuly login!', {
                    position: 'top-center'
                })

                router.push(redirect ? redirect : '/dashboard')
            }

            setRefreshReCaptcha(r => !r)
        }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
        >
            <form.Field
                name="username"
                validators={{
                    onChange: yup.string().min(3, 'username must be at least 3 characters'),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                }}
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <InputUI 
                            type="text" 
                            placeholder="Enter username ..." 
                            required 
                            id={field.name} 
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                         />
                         <FieldInfo field={field} />
                    </div>
                )}
            >
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onChange: yup.string().min(3, 'username must be at least 3 characters'),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                }}
                children={(field) => (
                        <div className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative float-right inset-y-6 right-6">
                                <div 
                                className="cursor-pointer absolute flex items-center mt-[12px] hover:text-slate-400"
                                onClick={() => setEnablePassword(!enablePassword)}
                                >{ enablePassword ? <FaEyeSlash />: <FaEye />  }</div>
                            </div>

                            <InputUI 
                            type={enablePassword ? "text" : "password"} 
                            required 
                            id={field.name} 
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter password ..." />

                            <FieldInfo field={field} />
                        </div>
                )}
            >
            </form.Field>

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit || isSuccess} className="w-full">
                            {isSubmitting
                                ?  (<> <CgSpinner className="mr-2 animate-spin" /> Loading... </>)
                                : isSuccess ?
                                    <div className='flex gap-1 items-center'><CgSpinner className="mr-2 animate-spin" />Redirecting...</div>
                                :
                                    "Sign-In"
                            }
                        </Button>
                )}
            />
        </form>
    )
}