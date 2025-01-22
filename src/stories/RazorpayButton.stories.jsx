import React from 'react';
import RazorpayButton from '../components/payments/RazorpayButton';

export default {
  title: 'Components/RazorpayButton',
  component: RazorpayButton,
};

const Template = (args) => <RazorpayButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  amount: 50000, // in paise -> INR 500
};
