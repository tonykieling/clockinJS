import React, { Component } from 'react';
import DatePicker from "react-datepicker";


class DateRangePicker extends Component {
  constructor(props, context) {
      super(props, context);
      // DatePicker is a controlled component.
      // This means that you need to provide an input value
      // and an onChange handler that updates this value.
  }
  render() {
      return <DatePicker
          id={this.props.id}
          selected={this.props.selected}
          onChange={this.props.onChange}
          onChangeRaw={this.props.onChangeRaw}
          onBlur={this.props.onBlur}
          peekNextMonth={true}
          showMonthDropdown={true}
          showYearDropdown={true}
          dropdownMode="select"
          placeholderText="MM/DD/YYYY"
          dateFormat="MM/DD/YYYY"
          shouldCloseOnSelect={true}
          defaultValue={null}
          />
  }

}
export default DateRangePicker;