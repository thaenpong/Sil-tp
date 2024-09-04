import { Box, Card, CardContent, Divider, Grid, Stack } from '@mui/material'
import React from 'react'


export default function FormCreateJob() {
    return (
        <React.Fragment>
            <Card sx={{ marginTop: '40px' }}>
                <CardContent>
                    <Stack divider={<Divider />} spacing={4}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                <h2>สร้างงานใหม่</h2>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}