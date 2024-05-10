type Props = {
  label: string;
  date: string;
  setDate: (date: string) => void;
  min: string;
};

const DatePicker = (props: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    props.setDate(value);
  };

  return (
    <div>
      <label htmlFor='date-picker'>{props.label}</label>
      <input
        id='date-picker'
        name='date-picker'
        type='date'
        placeholder='Delivery Date'
        value={props.date}
        onChange={handleChange}
        min={props.min}
      />
    </div>
  );
};

export default DatePicker;
