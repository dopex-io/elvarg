export const STEP = 0.1;
export const MIN_VAL = 0.1;
export const MAX_VAL = 100;
export const MARKS = [
  {
    value: 2.5,
    label: '2.5%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

const customSliderStyle = {
  '.MuiSlider-markLabel': {
    color: 'white',
  },
  '.MuiSlider-rail': {
    color: '#3E3E3E',
  },
  '.MuiSlider-mark': {
    color: 'white',
  },
  '.MuiSlider-thumb': {
    color: 'white',
    width: '16px',
    height: '16px',
  },
  '.MuiSlider-track': {
    color: '#22E1FF',
  },
};

export default customSliderStyle;
