import { useField } from "formik";
import { FormField, Label } from "semantic-ui-react";
import style from '../form/MyTextInput.module.css'
import DatePicker, {ReactDatePickerProps} from "react-datepicker";

const MyDateTimeInput = (props: Partial<ReactDatePickerProps>) => {
const [field, meta, helpers] = useField(props.name!);

  return (
    <FormField error={meta.touched && !!meta.error}>
        <DatePicker
         {...field} {...props}
         selected={(field.value && new Date(field.value) || null)}
         onChange={value => helpers.setValue(value)} >

        </DatePicker>
        { meta.touched && meta.error ? (
            <Label className={style.error} basic color="red">{meta.error}</Label>
        ) : null}
    </FormField>
  )
};

export default MyDateTimeInput;
