export interface AccountInputProps {
    defaultValue?: string | number;
    zodErrorMsg: string[] | undefined;
    id: string;
    name: string;
    type?: string;
    labelValue: string;
    containerClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
}
