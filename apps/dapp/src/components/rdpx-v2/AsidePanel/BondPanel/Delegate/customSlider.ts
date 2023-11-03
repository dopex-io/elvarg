export const STEP = 0.1;
export const MIN_VAL = 0.1;
export const MAX_VAL = 40;
export const MARKS = [
  {
    value: 2.5,
    label: '2.5%',
  },
  {
    value: 10,
    label: '10%',
  },
  {
    value: 20,
    label: '20%',
  },
  {
    value: 30,
    label: '30%',
  },
  {
    value: 40,
    label: '40%',
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
