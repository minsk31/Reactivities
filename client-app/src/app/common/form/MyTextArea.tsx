import { useField } from "formik";
import { FormField, Label } from "semantic-ui-react";
import style from '../form/MyTextInput.module.css'
interface Props{
    placeholder: string,
    name: string,
    labell?: string,
    rows: number
}

const MyTextArea = (props: Props) => {
const [field, meta] = useField(props.name);
  return (
    <FormField error={meta.touched && !!meta.error }>
        <label>{props.labell}</label>
        <textarea {...field} {...props} />
        { meta.touched && meta.error ? (
            <Label className={style.error} basic color="red">{meta.error}</Label>
        ) : null}

    </FormField>
  )
};

export default MyTextArea;
