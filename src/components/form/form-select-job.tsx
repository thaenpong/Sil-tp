import { Inputs, LowCaseCustomer, SilOrderPo, UpperCaseSilOrderPo } from '@/types/form'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { set, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface FormSelectProps {
    customers: LowCaseCustomer[]
    setValue: UseFormSetValue<Inputs>
    handleNext: () => void
    handleSkip: () => void
    handleBack: () => void
    watch: UseFormWatch<Inputs>
}

export default function FormCreateJob({ customers, setValue, handleNext, handleSkip, watch, handleBack }: FormSelectProps) {
    const [customer, setCustomer] = React.useState<LowCaseCustomer | null>(null);
    const [pos, setPo] = React.useState<SilOrderPo[] | null>(null);

    useEffect(() => {
        const fetchPoData = async () => {
            if (customer?.id) {  // Use optional chaining for conciseness
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SIL_API}/quick-request/active-po/${customer.id}`);

                    //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- necessary for dynamic API response type
                    const data: UpperCaseSilOrderPo[] = await res.json();  // Ensure you have a type defined for UpperCaseSilOrderPo
                    const silOrderpos: SilOrderPo[] = data.map(po => ({
                        id: po.Id,
                        name: po.Name.toLowerCase(),
                        width: po.Width,
                        length: po.Length,
                        amout: po.Amount,
                    }));
                    setPo(silOrderpos);
                } catch (error) {
                    toast.error(`Failed to fetch active POs: ${String(error)}`);  // Use template literals for string interpolation
                }
            } else {
                setPo(null); // Clear POs if no customer is selected
            }
        };

        fetchPoData()
            .catch(error => {
                toast.error(`An unexpected error occurred:' ${String(error)}`);
            });
    }, [customer]);  // Include customer in dependency array

    const handleBeforeBack = () => {
        setValue('customer', null);
        setValue('silPo', null);
        setValue('name', '');
        setValue('width', 0);
        setValue('length', 0);
        setValue('amount', null);
        setValue('product', { id: 1, name: '1p.  Full Sheet UV   ยูวีเต็มแผ่น' });
        handleBack();
    };

    return (
        <>
            <React.Fragment>
                <Autocomplete
                    value={watch('customer')}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    disablePortal
                    options={customers}
                    renderInput={(params) => <TextField {...params} label="เลือกลูกค้า" />}
                    getOptionLabel={(option) => option.name}
                    // getOptionKey is not a valid prop for Autocomplete, use key attribute if needed
                    onChange={(_, newValue) => {
                        setCustomer(newValue);
                        setValue('customer', newValue ? newValue : null);
                        setValue('silPo', null); // Reset silPo when customer changes
                        setPo(null); // Clear PO options when customer changes
                    }}

                />

                <Autocomplete
                    disablePortal
                    value={watch('silPo')}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    options={pos ?? []}
                    renderInput={(params) => <TextField {...params} label="เลือกคำสั่ง" />}
                    getOptionLabel={(option) => option.name}
                    // getOptionKey is not a valid prop for Autocomplete, use key attribute if needed
                    onChange={(_, value) => {
                        setValue("silPo", value ? value : null);
                        setValue('name', value ? value.name : '');
                        setValue('width', value ? value.width : 0);
                        setValue('length', value ? value.length : 0);
                        setValue("amount", value ? value.amout : null);
                        setValue("product", { id: 1, name: "1p.  Full Sheet UV   ยูวีเต็มแผ่น" })
                    }}
                />
            </React.Fragment>

            <React.Fragment>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        sx={{ mr: 1 }}
                        onClick={handleBeforeBack}
                    >
                        ย้อนกลับ
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button color="inherit" sx={{ mr: 1 }} onClick={handleSkip}>
                        สร้างคำสั่งใหม่
                    </Button>
                    <Button onClick={handleNext} variant={'contained'} disabled={watch('silPo') === null || watch('silPo') === undefined} >
                        ถัดไป
                    </Button>
                </Box>
            </React.Fragment>
        </>
    );
}
