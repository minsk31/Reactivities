import { useField } from "formik";
import { FormField, Label, Select } from "semantic-ui-react";
import style from '../form/MyTextInput.module.css'
interface Props{
    placeholder: string,
    name: string,
    labell?: string,
    options: {text: string, value: string}[]
}

const MySelectInput = (props: Props) => {
const [field, meta, helpers] = useField(props.name);
  return (
    <FormField error={meta.touched && !!meta.error }>
        <label>{props.labell}</label>
        <Select clearable
        options={props.options}
        value= {field.value || null}
        onChange={(_,d) => helpers.setValue(d.value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={props.placeholder} />
        { meta.touched && meta.error ? (
            <Label className={style.error} basic color="red">{meta.error}</Label>
        ) : null}

    </FormField>
  )
};

export default MySelectInput;
