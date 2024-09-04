import { Inputs } from '@/types/form';
import { Box, Button, Card, CardContent, IconButton, Stack, TextField, Typography } from '@mui/material';
import { PlusCircle as PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import React from 'react';
import { Control, useFieldArray, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface PileProps {
    control: Control<Inputs>
    watch: UseFormWatch<Inputs>
    handleNext: () => void
    setValue: UseFormSetValue<Inputs>
    handleBack: () => void
}


export default function FormPiles({ control, watch, handleNext, setValue, handleBack }: PileProps) {

    const { fields, append, remove } = useFieldArray({
        control,
        name: "piles"
    });

    const addPile = () => {
        append({ reference_id: '', height: 0 })
    }

    const isDisable = () => {
        const piles = watch('piles') || [];
        if (piles.length === 0) return true;

        return piles.some(pile => !pile.reference_id || !pile.height);
    };

    const validateLastPile = () => {
        const piles = watch('piles') || [];
        if (piles.length === 0) return false; // Enable button if there are no piles yet

        const lastPile = piles[piles.length - 1];
        return !(lastPile.reference_id && lastPile.height); // Disable button if last pile is invalid
    };


    const renderPile = () => {
        return (

            fields.map((item, index) => (
                <Stack spacing={3} marginBottom={3} key={item.id}>
                    <Card sx={{ position: 'relative' }}  >
                        <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start', pt: 2, px: 2 }}>
                            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                                <Typography color="text.secondary" variant="h6">
                                    <Typography color="text.primary" component="span" variant="inherit">
                                        ขาที่ {index + 1}
                                    </Typography>
                                </Typography>

                            </Stack>
                        </Stack>
                        <CardContent>
                            <Stack spacing={3}>
                                <TextField
                                    id="outlined-reference_id"
                                    label="รหัสขาอ้างอิงภายนอก"
                                    variant="outlined"
                                    value={watch(`piles.${index}.reference_id`)}
                                    onChange={(e) => {
                                        setValue(`piles.${index}.reference_id`, e.target.value);
                                    }}
                                />
                            </Stack>
                            <Stack spacing={3}>
                                <TextField
                                    type='number'
                                    id="outlined-height"
                                    label="ความสูง"
                                    variant="outlined"
                                    value={watch(`piles.${index}.height`)}
                                    onChange={(e) => {
                                        setValue(`piles.${index}.height`, Number(e.target.value));
                                    }}
                                />
                            </Stack>
                            <IconButton
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                                onClick={() => { remove(index) }}
                            >
                                <TrashIcon color='red' />
                            </IconButton>
                        </CardContent>

                    </Card>

                </Stack>
            ))

        )
    }


    const handleBeforeBack = () => {
        setValue('piles', []) // Reset piles when back
        handleBack();
    }

    return (
        <>
            <React.Fragment>
                <Card sx={{ marginTop: '40px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <h2>เพิ่มขางาน</h2>
                    </Box>
                    <CardContent>
                        {renderPile()}
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2 }}>
                                <Button variant="contained" startIcon={<PlusCircleIcon />} fullWidth color="success" onClick={addPile} disabled={validateLastPile()}>
                                    เพิ่มขางาน
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
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
                    <Button onClick={handleNext} variant={'contained'} disabled={isDisable()} >
                        ถัดไป
                    </Button>
                </Box>
            </React.Fragment>
        </>
    )
}