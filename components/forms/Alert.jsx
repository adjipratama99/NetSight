"use client"

import * as yup from 'yup'
import { useForm } from '@tanstack/react-form'
import { yupValidator as validatorAdapter } from "@tanstack/yup-form-adapter"
import { Button } from "../ui/button"
import InputUI from "../customs/forms/input"
import { Label } from "../ui/label"
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPost } from '@/lib/fetchPost';
import { ALERT_LIST } from '@/contexts/actions'

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

export default function AlertForm({ closeEvent }) {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: (params) => fetchPost({
            'url': '/api/device?dest=insertAlertData',
            body: params
        }, true),
        onSuccess(data) {
            if(data.code) {
                toast.success('Successfully add new alert');
                queryClient.invalidateQueries([ALERT_LIST])
                closeEvent(false)
            } else {
                toast.warn(data?.message)
            }
        }
    })
    const form = useForm({
        validatorAdapter,
        defaultValues: {
            email: ''
        },
        async onSubmit({ value }) {
            mutate(value)
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
                name="email"
                validators={{
                    onChange: yup.string().min(3, 'username must be at least 3 characters'),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                }}
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="email">E-mail</Label>
                        <InputUI 
                            type="text" 
                            placeholder="Enter email ..." 
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

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isPending} className="w-full">
                        {isSubmitting || isPending
                            ?  (<> <CgSpinner className="mr-2 animate-spin" /> Loading... </>)
                            :
                                "Submit"
                        }
                    </Button>
                )}
            />
        </form>
    )
}