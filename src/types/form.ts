export interface Employee {
    Id: number;
    FirstName: string;
    LastName: string;
    EmployeeCode: string;
    Department: {
        Id: number;
        Name: string;
    };
}

export interface Customer {
    Id: number
    Name: string
}

export interface LowCaseCustomer {
    id: number
    name: string
}

export interface UpperCaseProduct {
    Id: number;
    Name: string;
}

export interface Product {
    id: number;
    name: string;
}

export interface UpperCaseSilOrderPo {
    Id: number;
    Name: string;
    Width: number;
    Length: number;
    Amount: number;
}

export interface SilOrderPo {
    id: number;
    name: string;
    width: number;
    length: number;
    amout: number;
}

export interface Pile {
    reference_id: string;
    height: number;
}


export interface Inputs {
    customer: LowCaseCustomer | null;
    silPo: SilOrderPo | null;
    sil_order_id: number | null;
    name: string;
    width: number;
    length: number;
    product: Product | null;
    amount: number | null;
    piles: Pile[];
    employee_code: string;
}
