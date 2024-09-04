import { toast } from '@/components/core/toaster';
import type { Employee, Inputs } from '@/types/form';
import { Card, CardContent } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import styles from './css/style.module.css';
import React from 'react';

interface FormEmployeProps {
    setValue: UseFormSetValue<Inputs>;
    handleNext: () => void;
};

export default function FormEmployee({ setValue, handleNext }: FormEmployeProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    function success(decodedText: string): void {
        fetch(`${process.env.NEXT_PUBLIC_SIL_API}/quick-request/employee/detail/${decodedText}`)
            .then(response => {
                if (!response.ok) {
                    toast.error('ระบบมีปัญหา โปรดติดต่อแผนก IT!');
                }
                return response.json(); // Parse JSON response
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- necessary for dynamic API response type
            .then(async (data: Employee) => {
                const employee: Employee = data;

                if (employee) {
                    toast.success('บันทึกผู้ใช้สำเร็จ');
                    setValue('employee_code', employee.EmployeeCode);
                    handleNext();
                    if (scannerRef.current) {
                        await scannerRef.current.clear(); // Clear the scanner to stop further scanning
                    }
                }
            })
            .catch(() => {
                toast.error('ไม่พบหรัสพนักงาน!');
            });
    }

    function error(err: unknown): void {
        toast.error(String(err))
        // Handle errors if needed
    }

    useEffect(() => {
        if (!scannerRef.current) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 480,
                    height: 480,
                },
                fps: 5,
            }, false);

            scannerRef.current = scanner;
            scanner.render(success, error);
        }
    }, []);

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px', alignContent: 'center' }}>
                <CardContent>
                    <div id="reader" className={styles.qrCodeScanner} />
                </CardContent>
            </Card>
        </>
    );
}
