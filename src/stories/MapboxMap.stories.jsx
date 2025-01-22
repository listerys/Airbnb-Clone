import React from 'react';
import MapboxMap from '../components/maps/MapboxMap';

export default {
  title: 'Components/MapboxMap',
  component: MapboxMap,
};

const Template = (args) => <div style={{width: '400px', height: '300px'}}><MapboxMap {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  latitude: 40.7128,
  longitude: -74.0060,
};
