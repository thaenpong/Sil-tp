import React from 'react';
import FormStepper from '@/components/form/form-stepper';
import { Customer, LowCaseCustomer } from '@/types/form';
import { Box, Stack } from '@mui/system';



export default async function page() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SIL_API}/quick-request/all-customer-detail`);
    const customers: Customer[] = await res.json() as Customer[];

    const lowCaseCustomers: LowCaseCustomer[] = customers.map(customer => ({
        id: customer.Id,
        name: customer.Name.toLowerCase()
    }));

    return (
        <Box
            sx={{
                maxWidth: 'var(--Content-maxWidth)',
                m: 'var(--Content-margin)',
                p: 'var(--Content-padding)',
                width: 'var(--Content-width)',
            }}
        >
            <Stack spacing={4}>
                <FormStepper customer={lowCaseCustomers} />
            </Stack>
        </Box>
    )
}