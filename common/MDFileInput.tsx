import MDInput from "components/MDInput"
import { validateAttachment, validateDoc, validateIcon, validateImage, validatePdf } from "utils/common";

interface MDFileInputType {
    name: string;
    getValues?: any,
    type: "pdf" | "image" | "doc" | "icon" | "all" | string[];
    setValue: any;
    watch: any;
    setError: any;
    trigger: any;
    clearErrors: any;
}

const MDFileInput: React.FC<MDFileInputType> = ({ name, type, getValues, setValue, watch, setError, trigger, clearErrors }) => {

    const handleChange = (event: any) => {
        if (event.target.files) {
            let valid: string | boolean | undefined = '';
            switch (type) {
                case "pdf":
                    valid = validatePdf(event.target.files)
                    break;
                case "image":
                    valid = validateImage(event.target.files)
                    break;
                case "doc":
                    valid = validateDoc(event.target.files)
                    break;
                case "icon":
                    valid = validateIcon(event.target.files)
                    break;
                default:
                    valid = validateAttachment(event.target.files)
                    break;
            }

            if (valid === true) {
                setValue(name, event.target.files[0]);
                clearErrors(name);
                watch(name)
                trigger(name)
            } else {
                setError(name, {
                    type: "manual",
                    message: valid,
                })
                trigger(name)
            }
        }
    };

    return (
        <>
            <MDInput type="file" style={(typeof getValues(name)) == "string" ? { color: "transparent" } : {}} name={name} onChange={handleChange} />
            {
                getValues && (type = "image" || type == "icon") && typeof getValues(name) == "string" &&
                <img src={getValues(name)} alt="hy" width={'10%'} height={'10%'} />
            }
        </>
    )
}

export default MDFileInput; 