import { DEVICES_LIST } from "@/contexts/actions";
import { fetchPost } from "@/lib/fetchPost";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InputUI from "../customs/forms/input";
import { Label } from "../ui/label";
import { CgSpinner } from "react-icons/cg";
import { Button } from "../ui/button";
import { yupValidator as validatorAdapter } from "@tanstack/yup-form-adapter";
import * as yup from 'yup'
import { Select } from "../customs/forms/select";

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

export default function UpdateDevice({ data, closeEvent }) {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: (params) => fetchPost({
            url: '/api/device?dest=updateDevice',
            body: params
        }, true),
        onSuccess(data) {
            if(data.code) {
                toast.success('Successfully add new alert');
                queryClient.invalidateQueries([DEVICES_LIST])
                closeEvent(false)
            } else {
                toast.warn(data?.message)
            }
        }
    })

    const form = useForm({
        validatorAdapter,
        defaultValues: {
            deviceId: '',
            name: '',
            deviceType: '',
            latitude: '',
            longitude: ''
        },
        async onSubmit({ value }) {
            value.latitude = (value.latitude) ? parseFloat(value.latitude) : value.latitude
            value.longitude = (value.longitude) ? parseFloat(value.longitude) : value.longitude
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
                name="name"
                validators={{
                    onChange: yup.string().min(3, 'name must be at least 3 characters'),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                }}
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="name">Device Name</Label>
                        <InputUI 
                            type="text" 
                            placeholder="Enter device name ..." 
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
                name="deviceType"
                validators={{
                    onChange: yup.string().min(3, 'username must be at least 3 characters'),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                }}
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="deviceType">Device Type</Label>
                        <Select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onValueChange={(val) => field.handleChange(val)}
                            placeholder="Select device type"
                            fullWidth={true}
                            options={
                                [{
                                    value: "polsek",
                                    text: "Polsek"
                                },{
                                    value: "polres",
                                    text: "Polres"
                                },{
                                    value: "polda",
                                    text: "Polda"
                                }]
                            }
                        />
                         <FieldInfo field={field} />
                    </div>
                )}
            >
            </form.Field>

            <form.Field
                name="deviceId"
                validators={{
                    onChange: yup.string().min(3, 'username must be at least 3 characters'),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                }}
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="deviceId">Device </Label>
                        <Select
                                id={field.name}
                                required
                                fullWidth={true}
                                name={field.name}
                                value={field.state.value}
                                onValueChange={(val) => field.handleChange(val)}
                                placeholder="Select device"
                                options={
                                    data.result.map(device => { return { "value": device._id, "text": device.name } })
                                }
                                />
                         <FieldInfo field={field} />
                    </div>
                )}
            >
            </form.Field>

            <form.Field
                name="latitude"
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="name">Latitude</Label>
                        <InputUI 
                            type="text" 
                            placeholder="Enter latitude device ..." 
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
                name="longitude"
                children={(field) => (
                    <div className="mb-4">
                        <Label htmlFor="name">Longitude</Label>
                        <InputUI 
                            type="text" 
                            placeholder="Enter longitude device ..." 
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