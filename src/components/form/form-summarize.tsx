import { Button, Card, CardContent, Divider } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { PropertyList } from '../core/property-list'
import { PropertyItem } from '../core/property-item'
import { UseFormHandleSubmit, UseFormWatch } from 'react-hook-form'
import { Inputs } from '@/types/form'

interface SummarizeProps {
    watch: UseFormWatch<Inputs>
}

export default function FormSummarize({ watch }: SummarizeProps) {

    const customer = watch('customer');
    const name = watch('name');
    const product = watch('product');
    const width = watch('width');
    const length = watch('length');
    const piles = watch('piles');

    return (
        <>
            <React.Fragment>
                <Box sx={{ padding: { xs: '8px', sm: '16px' }, marginTop: { xs: '24px', sm: '46px' } }}>
                    <Card sx={{ padding: { xs: '8px', sm: '16px' } }}>
                        <CardContent>

                            <Card sx={{ borderRadius: 1, padding: { xs: '8px', sm: '16px' } }} variant="outlined">
                                <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': { xs: '8px 12px', sm: '12px 24px' } }}>
                                    {[{ key: 'ลูกค้า', value: customer?.name },
                                    { key: 'ชื่องาน', value: name },
                                    { key: 'คำสั่งงาน', value: product?.name },
                                    { key: 'ความกว้าง', value: `${width} นิ้ว` },
                                    { key: 'ความยาว', value: `${length} นิ้ว` },
                                    { key: 'จำนวนขา', value: `${piles?.length} ขา` }]
                                        .map((item): React.JSX.Element => (
                                            <PropertyItem key={item.key} name={item.key} value={item.value} />
                                        ))}
                                </PropertyList>
                            </Card>
                            <Card sx={{ marginTop: '10px', borderRadius: '10px' }}>

                                {piles?.map((pile, index) => (
                                    <Card sx={{ borderRadius: 1, margin: { xs: '8px', sm: '16px' } }} variant="outlined" key={index}>
                                        <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': { xs: '8px 12px', sm: '12px 24px' } }}>
                                            {[{ key: 'ขาที่', value: index + 1 },
                                            { key: 'รหัสขาอ้างอิง', value: `${pile?.reference_id} ซม.` },
                                            { key: 'ความสูง', value: `${pile.height} ซม.` }]
                                                .map((item): React.JSX.Element => (
                                                    <PropertyItem key={item.key} name={item.key} value={item.value} />
                                                ))}
                                        </PropertyList>
                                    </Card>
                                ))}
                            </Card>
                        </CardContent>
                    </Card>
                </Box>
            </React.Fragment>
        </>
    )
}