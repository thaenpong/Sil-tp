
"use client"
import { Inputs, LowCaseCustomer } from '@/types/form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import FormCreateJob from './form-create-job';
import FormEmployee from './form-employee';
import FormPiles from './form-piles';
import FormSelectJob from './form-select-job';
import FormSummarize from './form-summarize';
import Swal from 'sweetalert2';
import { toast } from '../core/toaster';

const steps = ['สแกนบัตรพนักงาน', 'เลือกคำสั่งลูกค้า', 'สร้างคำสั่งใหม่', 'บันทึกขางาน', 'สรุป'];

interface FormStepperProps {
    customer: LowCaseCustomer[]
}

export default function FormStepper({ customer }: FormStepperProps) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    //---------------------------------------------------------------------------------------------------------------------- react hook
    //#region
    const {
        watch,
        control,
        setValue,
        handleSubmit,
    } = useForm<Inputs>({
        defaultValues: {
            name: '',
            width: 0,
            length: 0,
            product: null,
            amount: null,
            employee_code: '',
            silPo: null,
            customer: null,
        }
    }
    );

    //#endregion
    //---------------------------------------------------------------------------------------------------------------------- 


    //---------------------------------------------------------------------------------------------------------------------- Handle Steps
    //#region
    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };



    const handleNext = (): void => {

        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        if (activeStep === 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 2);
            setSkipped(newSkipped);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }


        console.log(watch())
    };

    /* const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }; */

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setValue('name', '')
        setValue('width', 0)
        setValue('length', 0)
        setValue('product', null)
        setValue('amount', null)

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleBack = () => {
        if (activeStep === 3 && watch("silPo") !== null) {
            setActiveStep((prevActiveStep) => prevActiveStep - 2);
        }
        else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };
    //#endregion
    //---------------------------------------------------------------------------------------------------------------------- 

    //---------------------------------------------------------------------------------------------------------------------- Render Form
    //#region
    const renderForm = (step: number) => {
        switch (step) {
            case 0:
                return <FormEmployee setValue={setValue} handleNext={handleNext} />;
            case 1:
                return <FormSelectJob customers={customer} setValue={setValue} handleNext={handleNext} handleSkip={handleSkip} watch={watch} handleBack={handleBack} />;
            case 2:
                return <FormCreateJob />;
            case 3:
                return <FormPiles control={control} watch={watch} handleNext={handleNext} setValue={setValue} handleBack={handleBack} />;
            case 4:
                return <FormSummarize watch={watch} />;
            default:
                return null;
        }
    };

    //#endregion
    //---------------------------------------------------------------------------------------------------------------------- submit form
    //#region
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            console.log(data);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order: {
                        sil_order_id: data.sil_order_id ? Number(data.sil_order_id) : null,
                        customer: {
                            id: Number(data.customer?.id),
                            name: String(data.customer?.name)
                        },
                        name: data.name,
                        width: Number(data.width),
                        length: Number(data.length),
                        product: {
                            id: Number(data.product?.id),
                            name: String(data.product?.name)
                        },
                        amount: Number(data.amount),
                        employee_code: String(data.employee_code)
                    },
                    piles: data.piles.map((pile) => ({
                        reference_id: String(pile.reference_id),
                        height: Number(pile.height)
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            const orderId = responseData; // Assuming the response contains an 'id' field

            // Redirect to the dynamically constructed URL
            const imageUrl = `/images/${orderId}`;
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
                text: 'การสั่งของคุณถูกบันทึกแล้ว!',
                showConfirmButton: true
            }).then(() => {
                // Optionally redirect after the user closes the alert
                // router.push(imageUrl);
            });

        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามรถบันทึกได้',
                text: 'โปรติดต่อ IT!',
                showConfirmButton: true
            });
        }
    };

    //#endregion
    //----------------------------------------------------------------------------------------------------------------------

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <React.Fragment >
                <Box sx={{ width: '100%' }} >
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                    <Typography variant="caption">Optional</Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {renderForm(activeStep)}
                </Box>
            </React.Fragment>
            {activeStep === steps.length - 1 && (
                <React.Fragment>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }} marginBottom={4}>
                        <Button
                            color="inherit"
                            sx={{ mr: 1 }}
                            onClick={handleBack}
                        >
                            กลับ
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant={'contained'} disabled={watch('silPo') === null} type="submit" >
                            บันทึก
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </form>
    );
}
